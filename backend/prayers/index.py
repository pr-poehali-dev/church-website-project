import json
import os
import psycopg2
from datetime import datetime, date

def handler(event: dict, context) -> dict:
    '''API для работы с общими молитвами пользователей'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'GET':
            limit = int(event.get('queryStringParameters', {}).get('limit', '50'))
            
            cur.execute(f'''
                SELECT id, prayer_text, created_at 
                FROM {schema}.prayers 
                WHERE is_visible = TRUE 
                ORDER BY created_at DESC 
                LIMIT %s
            ''', (limit,))
            
            prayers = []
            for row in cur.fetchall():
                prayers.append({
                    'id': row[0],
                    'text': row[1],
                    'created_at': row[2].isoformat() if row[2] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'prayers': prayers, 'count': len(prayers)}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            prayer_text = body.get('prayer_text', '').strip()
            
            if not user_id or not prayer_text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and prayer_text are required'}),
                    'isBase64Encoded': False
                }
            
            if len(prayer_text) > 500:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Prayer text too long (max 500 characters)'}),
                    'isBase64Encoded': False
                }
            
            today = date.today()
            
            cur.execute(f'''
                SELECT COUNT(*) FROM {schema}.prayers 
                WHERE user_id = %s AND created_date = %s
            ''', (user_id, today))
            
            count = cur.fetchone()[0]
            
            if count >= 1:
                return {
                    'statusCode': 429,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'You can only add one prayer per day', 'limit_reached': True}),
                    'isBase64Encoded': False
                }
            
            cur.execute(f'''
                INSERT INTO {schema}.prayers (user_id, prayer_text, created_date) 
                VALUES (%s, %s, %s) 
                RETURNING id, created_at
            ''', (user_id, prayer_text, today))
            
            row = cur.fetchone()
            prayer_id = row[0]
            created_at = row[1]
            
            conn.commit()
            
            cur.execute(f'SELECT COUNT(*) FROM {schema}.prayers WHERE created_date = %s', (today,))
            today_count = cur.fetchone()[0]
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'prayer': {
                        'id': prayer_id,
                        'text': prayer_text,
                        'created_at': created_at.isoformat()
                    },
                    'today_count': today_count
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if conn:
            cur.close()
            conn.close()