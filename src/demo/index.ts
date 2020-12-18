import { PomeloImage } from "../core/image"

let demoImage = new PomeloImage({
  src: "./demo.jpg",
  width: 100,
  height: 100
})

console.log(demoImage.render('yomi'))
