const bluetooth = require('node-bluetooth');

// 创建蓝牙设备实例
const device = new bluetooth.DeviceINQ();

exports.handler = async (event) => {
  const action = event.queryStringParameters.action;

  if (action === 'search') {
    return searchBluetooth();
  } else if (action === 'connect') {
    const address = event.queryStringParameters.address;
    return connectBluetooth(address);
  } else if (action === 'send') {
    const address = event.queryStringParameters.address;
    const data = event.queryStringParameters.data;
    return sendData(address, data);
  } else if (action === 'preview') {
    return previewInterface();
  } else {
    return {
      statusCode: 400,
      body: 'Invalid action',
    };
  }
};

const searchBluetooth = () => {
  return new Promise((resolve, reject) => {
    device.listPairedDevices(devices => {
      resolve({
        statusCode: 200,
        body: JSON.stringify(devices),
      });
    });
  });
};

const connectBluetooth = (address) => {
  return new Promise((resolve, reject) => {
    device.findSerialPortChannel(address, (channel) => {
      bluetooth.connect(address, channel, (err, connection) => {
        if (err) {
          reject({
            statusCode: 500,
            body: 'Connection failed',
          });
        } else {
          resolve({
            statusCode: 200,
            body: 'Connected',
          });
        }
      });
    });
  });
};

const sendData = (address, data) => {
  return new Promise((resolve, reject) => {
    device.findSerialPortChannel(address, (channel) => {
      bluetooth.connect(address, channel, (err, connection) => {
        if (err) {
          reject({
            statusCode: 500,
            body: 'Connection failed',
          });
        } else {
          connection.write(new Buffer(data, 'utf-8'), (err, bytesWritten) => {
            if (err) {
              reject({
                statusCode: 500,
                body: 'Failed to send data',
              });
            } else {
              resolve({
                statusCode: 200,
                body: 'Data sent',
              });
            }
          });
        }
      });
    });
  });
};

const previewInterface = () => {
  return {
    statusCode: 200,
    body: 'Preview interface',
  };
};