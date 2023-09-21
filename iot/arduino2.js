const { SerialPort } = require("serialport");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.0.106:1884");
const topic = "iot2/info";

// 아두이노와 연결된 시리얼 포트 경로 (COM 포트 또는 /dev/ttyUSBx)
const portPath = "COM9"; // 아두이노가 연결된 시리얼 포트 경로를 지정하세요.

// 시리얼 포트 설정
const serialPort = new SerialPort({
  path: portPath,
  autoOpen: false,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
});

serialPort.open(() => {
  console.log("connected");

  // 데이터를 버퍼링할 변수 선언
  let bufferedData = "";

  serialPort.on("data", (data) => {
    const dataString = data.toString();
    bufferedData += dataString; // 데이터를 버퍼에 추가

    // 데이터가 끝났는지 확인
    if (bufferedData.includes("}]}")) {
      // 데이터의 끝 패턴을 확인
      console.log("전체 데이터 수신 완료:", bufferedData);

      // MQTT를 통해 전체 데이터 전송
      client.publish(topic, bufferedData, (err) => {
        if (err) {
          console.error("MQTT 전송 오류:", err);
        } else {
          console.log("MQTT로 데이터 전송 완료");
        }
      });

      // 버퍼를 비웁니다.
      bufferedData = "";
    }
  });
});
