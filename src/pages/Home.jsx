import React from "react";
import StarRating from "../components/StarRating";
import family from "../assets/images/family.png"
import serenity from "../assets/images/serenity.png"
import yoga from "../assets/images/yoga.png"
import screenshot from "../assets/images/screenshot.png"
import podcast from "../assets/images/podcast.png"
import comment from "../assets/images/comment.png"
import profilepic from "../assets/images/profilepic.png"
import diary from "../assets/images/diary.png"
import skincare from "../assets/images/skincare.png"
import bathtub from "../assets/images/bathtub.png"
import selflove from "../assets/images/selflove.png"
import jump from "../assets/images/jump.png"
import stretch from "../assets/images/stretch.png"
import { CiShoppingCart } from "react-icons/ci";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="h-screen w-full flex flex-col items-center ">

      <div className="h-screen w-full flex flex-col items-center px-4">

        <article className="w-[80%] mt-10 flex flex-col">
          <section>
            <div className="flex justify-center gap-3 font-semibold text-[80px] ">
              <span className="bg-[#9898F2] px-1 text-white w-fit h-fit">RESTORE</span>
              <span >YOUR BALANCE</span>
            </div>

            <div className="flex justify-center gap-3 font-semibold text-[80px] ">
              RECLAIM YOUR
              <div className="bg-[#006666] h-fit px-1 text-white">{" "} PRICE</div>
            </div>

            <div className="text-2xl text-center mb-3">Access curated wellness content, calming practices,
              and a supportive space to help you feel better — one step at a time.
            </div>
          </section>
          <img src={family} alt=""></img>
        </article>

        <article className="w-[60%] mt-2 flex flex-col">
          <div className="flex flex-col text-center gap-2 mt-4 ">
            <div className="italic font-medium text-6xl">Our Services</div>
            <div className="text-lg font-light "> Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals</div>
          </div>
        </article>

        <article className="flex flex-col gap-2">
          <section className="flex w-full h-fit gap-4 my-4 ">
            <div className="w-2/5">
              <img src={serenity} alt=""></img>
            </div>

            <div className="w-3/5 flex flex-col justify-between py-2">
              <div className="italic text-4xl">Personal Wellness</div>
              <div className="text-lg">Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goalsGet instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goalsGet instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals</div>
              <div className="w-fit border-[1px] border-[#4444B3] rounded-full font-semibold text-base p-2 text-[#4444B3]">See Programmes</div>
            </div>

          </section>

          <section className="flex w-full h-fit gap-4 my-4 ">
            <div className="w-3/5 flex flex-col justify-between py-2">
              <div className="italic text-4xl">Business Wellness</div>
              <div className="text-lg">Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goalsGet instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goalsGet instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals</div>
              <div className="w-fit border-[1px] border-[#4444B3] rounded-full font-semibold text-base p-2 text-[#4444B3]">See Programmes</div>
            </div>

            <div className="w-2/5">
              <img src={yoga} alt=""></img>
            </div>
          </section>
        </article>

        <article className="w-[50%] flex flex-col mt-4">
          <div className="flex flex-col text-center gap-2 mt-4 ">
            <div className="italic text-4xl">Your Personal Wellness Assistant, Powered by
              <span className="text-[#229999]">{" "} AI</span>
            </div>
            <div className="text-lg font-light mt-4 mb-8">
              Get instant, personalized wellness tips, mindfulness routines, or healthy meal suggestions based on your needs and goals</div>
          </div>
          <img src={screenshot} alt=""></img>
        </article>

        <img src={podcast} alt="" className="mt-3"></img>

        <article className="w-[50%] text-center font-medium  text-4xl mt-4">
          Words of praise from others about our presence
        </article>

        <article className="grid grid-rows-2 grid-cols-3 p-6">
          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>

          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>

          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>

          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>

          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>


          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>


          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>


          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>


          <section className=" p-4 flex flex-col gap-2">
            <div>
              <img src={comment} alt=""></img>
            </div>
            <div className="text-lg">We’re here to help! Whether you have a question about our services, need assistance with your account, or want to provide feedback, our team is ready to assist you. We’re here to help! </div>

            <div className="flex items-center gap-2">
              <img src={profilepic} alt=""></img>
              <div className="flex flex-col">
                <div>Gabrielle Williams</div>
                <div>CEO, Mandilla Inc.</div>
              </div>
            </div>
          </section>
        </article>

        <article className="flex flex-col p-6">
          <div className="text-3xl font-medium mb-6">Selected Products</div>
          <section className="grid grid-rows-2 grid-cols-4 gap-5">

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={diary} alt=""></img>
              <div className="text-xl">Wellness Journal/Planner</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={skincare} alt=""></img>
              <div className="text-xl">Eye Mask Sleep Support Bundle by Bundle</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={bathtub} alt=""></img>
              <div className="text-xl">Aromatherapy Diffuser + Essential Oils</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={diary} alt=""></img>
              <div className="text-xl">Wellness Journal/Planner</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={skincare} alt=""></img>
              <div className="text-xl">Eye Mask Sleep Support Bundle by Bundle</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={bathtub} alt=""></img>
              <div className="text-xl">Aromatherapy Diffuser + Essential Oils</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={diary} alt=""></img>
              <div className="text-xl">Wellness Journal/Planner</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

            <article className="flex border rounded-3xl p-4 gap-1 flex-col justify-center">
              <img src={skincare} alt=""></img>
              <div className="text-xl">Eye Mask Sleep Support Bundle by Bundle</div>

              <div className="flex justify-between">
                <div className="text-2xl font-medium">$22.50</div>
                <div className="flex gap-3  items-center">
                  <div className="line-through font-medium text-base">$32.50</div>
                  <div className="font-medium text-base text-[#229EFF] bg-[#E9F5FF] py-1 px-2">-14%</div>
                </div>
              </div>

              <div className="flex gap-2 items-center space-y-4">
                <div>
                  <StarRating rating={4.5} />     {/* default 5 stars, md size */}
                </div>
                <div className="pb-5 text-[#667085] text-sm">(124 reviews)</div>
              </div>

              <div className="bg-[#4444B3] rounded-full text-white flex gap-2 items-center py-3 px-6 w-fit">
                <div className="text-xl"><CiShoppingCart /></div>
                <button>Add to Cart</button>
              </div>
            </article>

          </section>
        </article>


        <article className="flex flex-col p-6">
          <div className="text-3xl font-medium mb-6">Featured Blog Content</div>

          <section className="grid grid-rows-1 grid-cols-3 gap-5">
            <div className="flex flex-col gap-1 border rounded-3xl p-4 justify-center=">
              <img src={jump} alt=""></img>
              <div className="pb-5 text-[#667085] text-sm font-semibold">March 4, 2025</div>
              <div className="text-2xl font-medium mb-4">10 Innovative workplace wellness tips: Unlocking Happiness at Work</div>
              <div className="text-lg text-[#667085]">Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment. These 10 wellness tips are designed to help you and your team thrive</div>

              <div className="flex gap-1">
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Wellness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Mindfulness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Workplace</div>
              </div>
            </div>

            <div className="flex flex-col gap-1 border rounded-3xl p-4 justify-center=">
              <img src={stretch} alt=""></img>
              <div className="pb-5 text-[#667085] text-sm font-semibold">March 4, 2025</div>
              <div className="text-2xl font-medium mb-4">10 Innovative workplace wellness tips: Unlocking Happiness at Work</div>
              <div className="text-lg text-[#667085]">Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment. These 10 wellness tips are designed to help you and your team thrive</div>

              <div className="flex gap-1">
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Wellness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Mindfulness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Workplace</div>
              </div>
            </div>

            <div className="flex flex-col gap-1 border rounded-3xl p-4 justify-center=">
              <img src={selflove} alt=""></img>
              <div className="pb-5 text-[#667085] text-sm font-semibold">March 4, 2025</div>
              <div className="text-2xl font-medium mb-4">10 Innovative workplace wellness tips: Unlocking Happiness at Work</div>
              <div className="text-lg text-[#667085]">Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment. These 10 wellness tips are designed to help you and your team thrive</div>

              <div className="flex gap-1">
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Wellness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Mindfulness</div>
                <div className="font-medium text-xs text-[#667085] rounded-full p-2 border bg-[#C7C7C729]">Workplace</div>
              </div>
            </div>
          </section>
        </article>


        <div className="flex w-full items-center">

          <div className="w-1/2  p-4 flex flex-col gap-3">
            <div className="text-5xl">Stay in the wellness loop!</div>
            <div className="text-lg text-[#475464]">Subscribe to our newsletter for exclusive tips, stories, and product updates to support your wellness journey.</div>
          </div>

          <div className="flex w-1/2 p-4 items-center justify-center py-20  ">
            <div className="bg-[#F9F9F9] shadow-lg flex flex-col rounded-2xl w-full  p-6 space-x-2 ">
              <label>Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="flex-1 px-4 py-2 bg-white border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-8 rounded-full mt-4 py-2 bg-[#4444B3] w-fit  text-white font-medium hover:bg-blue-400 transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>
      <Footer/>
      </div>

    </main>
  );
};

export default Home;
