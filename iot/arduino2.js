const { SerialPort } = require("serialport");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.0.106:1884");
const topic = "iot2/info";
const portPath = "COM9";
const serialPort = new SerialPort({
  path: portPath,
  autoOpen: false,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
});

serialPort.open(() => {
  console.log("connected");

  let bufferedData = "";

  serialPort.on("data", (data) => {
    const dataString = data.toString();
    bufferedData += dataString; 

    if (bufferedData.includes("}]}")) {
      console.log("전체 데이터 수신 완료:", bufferedData);

      client.publish(topic, bufferedData, (err) => {
        if (err) {
          console.error("MQTT 전송 오류:", err);
        } else {
          console.log("MQTT로 데이터 전송 완료");
        }
      });

      bufferedData = "";
    }
  });
});
