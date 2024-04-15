from flask import Flask, render_template, jsonify, request
import openai  
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import google.generativeai as palm

app = Flask(__name__)

# Configuration for the SQLite database (you can use a different database as needed)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///survey.db'
db = SQLAlchemy(app)

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(50))

# Set the first API key
openai.api_key ="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"

def generateResponse1(prompt):
    messages = []

    messages.append({"role": "system", "content": "You are a helpful assistant."})

    question = {}
    question['role'] = 'user'
    question['content'] = prompt
    messages.append(question)

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

    try:
        answer = response['choices'][0]['message']['content']
    except:
        answer = "Oops, You Beat the AI, try a different question"

    return answer

# Set the second API key
palm.configure(
    api_key="AIzaSyCrj5kjsweur3JcgSkxfZkQit2vyo240kg"
)

    # Generate text using the PaLM model
def generateResponse2(prompt):
    response = palm.generate_text(
        model="models/text-bison-001",
        prompt=prompt,
        temperature=0,
        max_output_tokens=1024
    )

    return response.result

@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        
        prompt = request.form['prompt']
        res1 = generateResponse1(prompt)
        res2 = generateResponse2(prompt)
        
        response = {
            'response1': res1,
            'response2': res2
        }
        
        return jsonify(response)    
        
    return render_template('index.html', **locals())
# ... (code for handling the main route)

@app.route("/record_response", methods=["POST"])
def record_response():
    model = request.form["model"]

    response = Response(model=model)
    db.session.add(response)
    db.session.commit()

    return "Response recorded successfully"
# ... (code for recording responses in the database)

@app.route("/get_survey_data")
def get_survey_data():
    # Use SQLAlchemy to fetch survey data
    query = text("SELECT model, COUNT(id) AS votes FROM response GROUP BY model")
    with db.engine.connect() as conn:
     result = conn.execute(query)
    survey_data = {"models": [], "votes": []}
    for row in result:
        survey_data["models"].append(row[0])
        survey_data["votes"].append(row[1])

    return jsonify(survey_data)
 # ... (code for fetching survey data from the database)

if __name__ == '__main__':
    with app.app_context():
     db.create_all()
    app.run(host='0.0.0.0', port='2222', debug=True)
