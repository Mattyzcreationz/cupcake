from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'oh-so-secret'

connect_db(app)


@app.route('/')
def root():
    return render_template('base.html')


@app.route('/api/cupcakes')
def list_cupcakes():
    cupcakes = [cupcake.to_dict() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=cupcakes)


@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    data_set = request.json
    cupcake = Cupcake(
        flavor=data_set['flavor'],
        rating=data_set['rating'],
        size=data_set['size'],
        image=data_set['image'] or None)
    db.session.add(cupcake)
    db.session.commit()
    return (jsonify(cupcake=cupcake.to_dict()), 201)


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def remove_cake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message='Deleted')


if __name__ == '__main__':
    app.run(debug=True)
