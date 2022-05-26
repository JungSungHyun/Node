const express = require("express");//서버를 키던 router를 쓰던 express를 요청해야한다.
const Goods = require("../schemas/goods");//db안에 Goods라는 collection를 쓰기위해서
const Cart = require("../schemas/cart");//db안에 Cart라는 collection를 쓰기위해서
const router = express.Router();//router를 쓰기위해 router를 생성한다 이것 역시 미들웨어이다.


router.get("/", (req, res) => {//get으로 "/"라는 것을 요청했고 서버는 res.send안에 메세지를 담아 보냄
  res.send("this is root page");
});

router.get("/goods", async (req, res) => { //goods라는 페이를 요청 

  const {category} = req.query;//cartegory라는 값을 요청 받았고, query로 받아 {category}에 담았음

  console.log("category",category);//어떤 category인지 확인
  const goods = await Goods.find({category});//goods에 해당 category를 찾는다.
  res.json({//json형식으로 goods를 담아서 보냄
    goods,
  });
});


router.get("/goods/cart",async(req,res)=>{//api=>/goods/cart이고 get으로 받음 =>장바구니 목록
  const carts = await Cart.find();//Cart에 담겨져 있는 db를 모두 찾음
  const goodsId = carts.map((cart)=>{//map을 써서 cart에 goodsid만 담은 새로운 배열을 goodsId에 넣음
      return cart.goodsId;
  });
  const goods = await Goods.find({goodsId : goodsId})//그리고goods에 goodsId값만 찾아서 넣음
 
  res.json({
      cart: carts.map((cart)=>{//carts를 map을 해서 cart에 담아서 quntity의 값을 따로 가져와서 goods의 id값과 cart의 id값을 비교해서 맞는 것만 보내겠다.
          return {
              quantity: cart.quantity,
              goods: goods.find((item)=>{
                  return item.goodsId === cart.goodsId;
              }),
          };
      }),
  })
});


// /goods/1234 => 1234가 goodsid가 된다는 뜻
router.get("/goods/:goodsid", async (req, res) => {//특정 상품 조회

  const goodsId = req.params.goodsid; //goodid를 파라미터로 받는데 goodid를 받음

  const [goods] = await Goods.find({ goodsId: Number(goodsId) });//파라미터로 받은 goodid를 해당 상품을 찾아서 보냄
  res.json({
    goods,
  });
});



router.post("/goods/:goodsId/cart",async (req,res)=>{//장바구니에 담기
  const {goodsId} = req.params//요쳥한 값을 goodsId라는 값에 넣음 => :goodsId
  const {quantity} = req.body; //quantity의 값을 받아서 넣음
  const existscarts = await Cart.find( { goodsId : Number(goodsId) } );

  if(existscarts.length){//해당 상품이 장바구니에 있는지 없는지 확인
    return res.status(400).json({success : false, errorMessage: "이미 장바구니에 들어있는 상품입니다."});
  }
  await Cart.create({ goodsId: Number(goodsId), quantity });
  res.json({success: true});
});

router.delete("/goods/:goodsId/cart",async (req,res)=>{
  const {goodsId} = req.params//삭제할 상품Id를 받아온다.
  const existscarts = await Cart.find( { goodsId : Number(goodsId) } );

  if(existscarts.length){//만약 그 상품이 있다면 삭제한다.
   await Cart.deleteOne({goodsId : Number(goodsId)});
  }
  res.json({success:true})
});

router.put("/goods/:goodsId/cart",async (req,res)=>{//수정은 put과 patch가 있는데 put은 모든 정보를 수정할 때 주로 쓰이고 patch는 부분을 수정할 때 쓰인다.
  const {goodsId} = req.params;

  const {quantity} = req.body;

  const existscarts = await Cart.find( { goodsId : Number(goodsId) } );
  if(!existscarts.length){
    await Cart.create({ goodsId: Number(goodsId), quantity });
  }else{
    await Cart.updateOne({goodsId : Number(goodsId)}, { $set: { quantity } });//updateOne 첫번째 메소드는 업데이트할 메소드이고 두번째는 어떻게 업데이트 할것인가.$Set 값 변경키워드임
  }
  
  res.json({success : true}); 
});

router.post("/goods", async (req, res) => {

  const { goodsId, name, thumbnailUrl, category, price } = req.body; //body는 많은 데이터를 받을때 쓴다.

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터 입니다." });
  }
  const creategoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price })

  res.json({ goods: creategoods });
});

module.exports = router;//node.js에서 약속한 모듈로서 내보내겠다라는 것.