import hashlib
import hmac
from urllib.parse import urlencode
from datetime import datetime, timedelta

now = datetime.now() 
expire = now + timedelta(minutes=15)
def build_vnpay_url(amount, order_id, ip, return_url, tmn_code, secret_key, vnp_url):
    params = {
        "vnp_Version": "2.1.0",
        "vnp_Command": "pay",
        "vnp_TmnCode": tmn_code,
        "vnp_Amount": int(amount) * 100,
        "vnp_CurrCode": "VND",
        "vnp_TxnRef": str(order_id),
        "vnp_OrderInfo": f"Thanh toan don hang {order_id}",
        "vnp_OrderType": "billpayment",
        "vnp_Locale": "vn",
        "vnp_ReturnUrl": return_url,
        "vnp_IpAddr": ip,
    }
    params["vnp_CreateDate"] = now.strftime("%Y%m%d%H%M%S")
    params["vnp_ExpireDate"] = expire.strftime("%Y%m%d%H%M%S")


    sorted_params = sorted(params.items())
    query_string = urlencode(sorted_params)

    sign_data = hmac.new(
        secret_key.encode(),
        query_string.encode(),
        hashlib.sha512
    ).hexdigest()

    return f"{vnp_url}?{query_string}&vnp_SecureHash={sign_data}"
