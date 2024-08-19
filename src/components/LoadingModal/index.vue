<template>
  <div class="juhua-loading">
    <div class="jh-circle"></div>
    <div class="jh-circle2 jh-circle"></div>
    <div class="jh-circle3 jh-circle"></div>
    <div class="jh-circle4 jh-circle"></div>
    <div class="jh-circle5 jh-circle"></div>
    <div class="jh-circle6 jh-circle"></div>
    <div class="jh-circle7 jh-circle"></div>
    <div class="jh-circle8 jh-circle"></div>
    <div class="jh-circle9 jh-circle"></div>
    <div class="jh-circle10 jh-circle"></div>
    <div class="jh-circle11 jh-circle"></div>
    <div class="jh-circle12 jh-circle"></div>
  </div>
</template>

<style scoped>
.juhua-loading {
  position: relative;
  width: 40px;
  height: 40px;
}
.juhua-loading .jh-circle {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.juhua-loading .jh-circle:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: #333;
  border-radius: 100%;
  -webkit-animation: jh-circleFadeDelay 1.2s infinite ease-in-out both;
  animation: jh-circleFadeDelay 1.2s infinite ease-in-out both;
}
.juhua-loading .jh-circle2 {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}
.juhua-loading .jh-circle3 {
  -webkit-transform: rotate(60deg);
  -ms-transform: rotate(60deg);
  transform: rotate(60deg);
}
.juhua-loading .jh-circle4 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.juhua-loading .jh-circle5 {
  -webkit-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  transform: rotate(120deg);
}
.juhua-loading .jh-circle6 {
  -webkit-transform: rotate(150deg);
  -ms-transform: rotate(150deg);
  transform: rotate(150deg);
}
.juhua-loading .jh-circle7 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.juhua-loading .jh-circle8 {
  -webkit-transform: rotate(210deg);
  -ms-transform: rotate(210deg);
  transform: rotate(210deg);
}
.juhua-loading .jh-circle9 {
  -webkit-transform: rotate(240deg);
  -ms-transform: rotate(240deg);
  transform: rotate(240deg);
}
.juhua-loading .jh-circle10 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}
.juhua-loading .jh-circle11 {
  -webkit-transform: rotate(300deg);
  -ms-transform: rotate(300deg);
  transform: rotate(300deg);
}
.juhua-loading .jh-circle12 {
  -webkit-transform: rotate(330deg);
  -ms-transform: rotate(330deg);
  transform: rotate(330deg);
}
.juhua-loading .jh-circle2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.juhua-loading .jh-circle3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.juhua-loading .jh-circle4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.juhua-loading .jh-circle5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.juhua-loading .jh-circle6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.juhua-loading .jh-circle7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.juhua-loading .jh-circle8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.juhua-loading .jh-circle9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.juhua-loading .jh-circle10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.juhua-loading .jh-circle11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.juhua-loading .jh-circle12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}
@-webkit-keyframes jh-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
@keyframes jh-circleFadeDelay {
  0%,
  39%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
