from flask import Flask, request 
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/api', methods=['POST'])
@cross_origin()
def post_existing_models(): 
    print("posting existing models")
    return 'world!'
    
if __name__ == "__main__":
    app.run(debug = True)
