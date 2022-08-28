const qr = require("qrcode");
const CRC16 = require("crc/crc16ccitt");

module.exports = async () => {
  try {
    const rand = () => {
      let count = {};
      return [10, 10, 10]
        .map(function (a) {
          let v;
          do {
            v = Math.floor(Math.random() * a);
          } while (count[v] && count[v] > 1);
          count[v] = (count[v] || 0) + 1;
          return v;
        })
        .join("");
    };

    const zeroPad = (nr, base) => {
      let len = String(base).length - String(nr).length + 1;
      return len > 0 ? new Array(len).join("0") + nr : nr;
    };

    const qty = "1" + rand();
    const qtyLength = zeroPad(qty.toString().length, 10);
    const qris = process.env.QRIS.slice(0, -4)
      .replace("010211", "010212")
      .replace("5802ID", `54${qtyLength}${qty}5802ID`);

    return await qr.toDataURL(qris + CRC16(qris).toString(16));
  } catch (err) {
    console.log(err);
    next(err);
  }
};
