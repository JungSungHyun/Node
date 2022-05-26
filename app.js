const express = require("express");//express의 패키지를 불러옴
const connect = require("./schemas")//db와 연결하고 저장할 schemas파일을 불러온다. mongodb는 비관계형db지만 이것을 통해 제약을 줄 수 있다. 
const app = express();//express의 서버객체를 받아온다. 꼭 이렇게 쓰라고 express페이지에 명시 되어있음.
const port = 3000;//3000이라는 포트를 의미함. 300포트를 사용하겠다. loacl환경에서
const bodyParser = require("body-parser");//최신버젼은



connect();//db와 연결

const goodsRouter = require("./routes/goods");//router를 만들어도 app.js에서는 그 사실을 모르기 때문에 불러오는 것
const cartsRouter = require("./routes/carts");


/*
미들웨이 : 공통적으로 무언가를 응답과 요청을 할 때 쓰는 것
listen : 서버를 키는 것
get : getmethod
use : 보통 use를 미들웨어라고한다.
 next();//다음 미들웨어로 넘어가게 해주는 다리 역할 use라는 미들웨어를 쓸 때 주로 쓰인다. res로 응답을 보내줄수도 있지만, 주로 데이터를 가공한 것을 보낼 때 쓰인다.
    //res.send("미들웨어의 응답이에요");//왠만하면 next함수를 써라 이렇게 하는것은 공통적인 데이터를 가공해서 보내줄때 쓴다. 하지만 거의 next함수를 쓰는게 좋다.
*/

const requsetMiddleware = (req,res,next) =>//요청한 url과 그 시간을 console.log로 보여주는 함수를 만듬
{
    console.log("Request URL : ", req.originalUrl, " - ", new Date());
    next();
};


app.use(express.urlencoded());//express 서버로 post요청을 할 때 input태그의 value를 전달하기 위해 사용한다. 원래는 body-parser라는 것을 불러와야하지만 
//express 4.16버젼부터는 내장되있으므로 urlencoded만 해주면 된다. 이것을 사용하는 이유는 요청의 본문 데이터가 URL-encoded형식의 문자열로 오기 때문에
//객체로 변환이 필요하다.
//app.use(bodyParser.json());

app.use(express.static("static"));//Html을 쓰기위해서??

app.use(express.json());//JSON 문자열로 넘어오는 경우 express.json() 미들웨어를 사용합니다.

app.use(requsetMiddleware);//함수로 만든 것을 미들웨어로 썼다.

app.use("/api",[goodsRouter,cartsRouter]);//goodsrouter와 cartsrouter를 /api/~~~~로 받겠다


app.get("/",(req,res)=>{//http가 /라는 경로로 뭔가를 받았을때 처리해주는 것, get에 req객체와 res객체를 넣어준다.
    res.send("hello world123123123");
});


app.listen(port, () =>{ //서버를 키는 것
    console.log(port, "포트로 서버가 커졌어요");
});
