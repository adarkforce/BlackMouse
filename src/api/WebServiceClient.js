RIGHT_MOUSE_CLICK_URI = "/MouseRightClick";
LEFT_MOUSE_CLICK_URI = "/MouseLeftClick";
MOUSE_POSITION_URI = "/MousePosition";
KEYBOARD_URI = "/KeyHandler";
SCROLL_URI = "/Scroll"
GET_SCROLL_SENSITIVITY_URI = "/getScrollSensitivity"
GET_POINTER_SENSITIVITY_URI = "/getPointerSensitivity"
POST_SCROLL_SENSITIVITY_URI = "/postScrollSensitivity"
POST_POINTER_SENSITIVITY_URI = "/postPointerSensitivity"


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

    async callScroll(event){
        try {
            await fetch('http://' + this.ip + ":" + this.port + SCROLL_URI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scrollX: event.velocityX,
                    scrollY: event.velocityY,
                })
            })
        } catch (err) {
            console.warn(err);
        }
    }

    async getScrollSensitivity(){
        try {
            var res = await fetch('http://' + this.ip + ":" + this.port + GET_SCROLL_SENSITIVITY_URI, {
                method: "GET",
            })
            return res;
        } catch (err) {
            console.warn(err);
            return err;
        }
    }

    async getPointerSensitivity(){
        try {
            var res = await fetch('http://' + this.ip + ":" + this.port + GET_POINTER_SENSITIVITY_URI, {
                method: "GET",
            })
            return res;
        } catch (err) {
            console.warn(err);
            return err;
        }
    }

    async postPointerSensitivity(value){
        try {
            var res = await fetch('http://' + this.ip + ":" + this.port + POST_POINTER_SENSITIVITY_URI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    
                    pointerSensitivity: value,
                })
            })
            return res;
        } catch (err) {
            console.warn(err);
            return err;
        }
    }
    async postScrollSensitivity(value){
        try {
            var res = await fetch('http://' + this.ip + ":" + this.port + POST_SCROLL_SENSITIVITY_URI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scrollSensitivity: value,
                })
            })
            return res;
        } catch (err) {
            console.warn(err);
            return err;
        }
    }

}

export default WebServiceClient;