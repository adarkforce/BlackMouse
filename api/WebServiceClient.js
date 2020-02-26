RIGHT_MOUSE_CLICK_URI = "/MouseRightClick";
LEFT_MOUSE_CLICK_URI = "/MouseLeftClick";
MOUSE_POSITION_URI = "/MousePosition";
KEYBOARD_URI = "/KeyHandler";

class WebServiceClient {

    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.moveMouse = this.moveMouse.bind(this)
    }

    async callMouseRightClick() {
        try {
            await fetch('http://' + this.ip + ":" + this.port + RIGHT_MOUSE_CLICK_URI, {
                method: 'GET',
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async callMouseLeftClick() {
        try {
            await fetch('http://' + this.ip + ":" + this.port + LEFT_MOUSE_CLICK_URI, {
                method: 'GET',
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async moveMouse(event) {
        let { nativeEvent } = event;
        console.log("MOUSE MOVING IP : " + this.ip)
        try {
            await fetch('http://' + this.ip + ":" + this.port + MOUSE_POSITION_URI, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body:
                    JSON.stringify({
                        mouseDeltaX: nativeEvent.velocityX,
                        mouseDeltaY: nativeEvent.velocityY,
                        /*deviceSize: JSON.stringify({
                            'x': Math.round(Dimensions.get('window').width),
                            'y': Math.round(Dimensions.get('window').height)
                        })*/
                    })
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async sendKeyboardKey(key) {
        try {
            await fetch('http://' + this.ip + ":" + this.port + KEYBOARD_URI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: key,
                })
            })
        } catch (err) {
            console.warn(err);
        }
    }
}

export default WebServiceClient;