const express = require("express");//express의 패키지를 불러옴
const app = express();//express의 서버객체를 받아온다. 꼭 이렇게 쓰라고 express페이지에 명시 되있고 제약되어있음.
const port = 3000;//3000이라는 포트를 의미함.

app.listen(port, () =>
{
    console.log(port, "포트로 서버가 커졌어요");
});
