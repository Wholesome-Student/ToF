import qrcode

def create_text_qrcode(text, filename):
    # QRコードの作成
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)

    # 画像の作成
    img = qr.make_image(fill_color="black", back_color="white")

    # 画像の保存
    img.save(filename)

# テキストデータ
text_data = "e798582707b6ca5e930168259d61e797020f89190dea9faf6064ff45c3a7860c"

# QRコードを作成して保存
create_text_qrcode(text_data, "2.png")
