from quart import Quart, jsonify, request, render_template
from quart_cors import cors
import traceback
import math
import os

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.route('/api/v1/execute', methods=['POST'])
async def index():

    data = await request.get_data()
    data = data.decode('utf-8')

    if "import" in data:
        return jsonify({'error': 'Imports are not allowed', "traceback": "The math Module is provided by default."})
        
    if "open(" in data:
        return jsonify({'error': 'Nein Herr Weber Sie dürfen keine Dateien öffnen.', "traceback": "\n"})
    
    output = []
    output_strings = []

    try:
        exec(data, {'math': math, 'print': output.append})
        output_strings = [str(o) for o in output]

    except Exception as e:
        error = traceback.format_exc()
        error = '\n'.join(error.split('\n')[3:])
        return jsonify({'error': str(e), 'traceback': error})
    
    return jsonify({'message': 'success', 'output': output_strings})

@app.route('/')
async def home():
    return await render_template('index.html')

@app.route('/<path:path>')
async def catch_all(path):
    if not os.path.exists(f'templates/{path}.html'):
        print(f'templates/{path}.html')
        return await render_template('index.html')
    
    return await render_template(path + '.html')


app.run(host="0.0.0.0", port=3090)