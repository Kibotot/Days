let controller;
let slideScene;
let pageScene;
const burger = document.querySelector(".burger");

gsap.config({
  nullTargetWarn: false,
});
function animateSlides() {
  //initializing the Controller
  controller = new ScrollMagic.Controller();

  //selecting
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImage = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    //GSAP
    const slideTl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power4.easeOut",
      },
    });
    slideTl.fromTo(revealImage, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 1.5 }, { scale: 1 }, "-=1"); //animation 1sec sooner "-=1"
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=.725");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.7");
    //creating a scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.5,
      reverse: false, //no repeat on !first scroll down
    })
      .setTween(slideTl) //duplicating properties from slideTl to slideScene
      .addTo(controller);
    //new animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    //create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function cursor(e) {
  let mouse = document.querySelector(".cursor");
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const mouse = document.querySelector(".cursor");
  const mouseTxt = mouse.querySelector("span");
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerText = "tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseTxt.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", background: "black" });
    gsap.to("#logo", 0.7, { color: "black" });
    gsap.to(".nav-bar", 0.7, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "-45", background: "white" });
    gsap.to("#logo", 0.7, { color: "white" });
    gsap.to(".nav-bar", 0.7, { clipPath: "circle(0px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

//barba.js page transitions
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          current.container,
          1,
          { opacity: 1 },
          { opacity: 0, onComplete: done }
        );
      },
      enter({ current, next }) {
        let done = this.async();
        window.scrollTo(0, 0);
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          current.container,
          1,
          { opacity: 0 },
          { opacity: 1, onComplete: done }
        );
      },
    },
  ],
});

//event listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
