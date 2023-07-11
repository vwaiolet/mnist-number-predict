from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import base64
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    # 클라이언트로부터 이미지 데이터 받기
    image = request.get_json().get('image')
    image = image[22:]
    #print(image)
    image = base64.b64decode(image)
    image = Image.open(io.BytesIO(image))
    # 이미지 처리 및 예측 작업 수행
    img = image.convert('L')  # 흑백 이미지로 변환
    img = img.resize((28, 28))  # 이미지 크기 조정
    img = np.array(img)  # Numpy 배열로 변환
    img = img.reshape(-1, 28, 28, 1)
    img = img / 255.0
    model = tf.keras.models.load_model('Predict_Model.h5')
    pred = model.predict(img)
    prediction = np.argmax(pred)
    result = {'prediction': int(prediction), 'per': int(round(pred[0][prediction] * 100))}
    print("예측값 : ", int(prediction))
    print(round(pred[0][prediction] * 100), '% 확률로 예측')
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)