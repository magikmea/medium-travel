import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import { client } from "../../sanity/lib/client";
import { urlForImage } from "../../sanity/lib/image";
import {Footer} from "../../components/Footer"
import { Post } from "../../typing";
import newslettergif from "../../components/gifs/New message.gif";
import { useRouter } from "next/router";
import Image from "next/image";
import { BiUpArrow } from "react-icons/bi";
import { GoStar } from "react-icons/go";
import { BsTwitter } from "react-icons/bs";
import { GrFacebook } from "react-icons/gr";
import { BsLinkedin } from "react-icons/bs";
import { RiMailSendLine } from "react-icons/ri";
import { IoCopy } from "react-icons/io5";
import { BiErrorAlt } from "react-icons/bi";
import BlockContent from "@sanity/block-content-to-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { FiSearch } from "react-icons/fi";
import { RiMailAddLine } from "react-icons/ri";
import { useAppContext } from "../../components/context";
import { VscClose } from "react-icons/vsc";
import { BsChevronLeft } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { db } from "../../components/firebase/firebase-config";
import { addDoc, collection } from "firebase/firestore";

// interface
interface Props {
  post: Post;
}
interface Props {
  posts: [Post];
}
// interface

// scroll to top
function scrolltotop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
// scroll to top

function Post({ post, posts }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submited, setsubmited] = useState(false);
  const [sign, setsign] = useState(0);
  const [issending, setissending] = useState(false);
  const router = useRouter();
  const [usersetting, setusersetting] = useState(false);
  const [signup, setsignup] = useState(false);
  const {
    user,
    Emailuser,
    createUser,
    signInWithGoogle,
    signUpWithGoogle,
    logout,
    setfullname,
    fullname,
    // sign in & sign up
    handlesubmit,
    login,
    registeremail,
    setregisteremail,
    registerpassword,
    setregisterpassword,
    messageerr,
    setmessageerr,
    messageerr1,
    setmessageerr1,
    messageerr2,
    setmessageerr2,
    loginemail,
    setloginemail,
    loginpassword,
    setloginpassword,
    successlogin,
    setsuccesslogin,
    // sign in & sign up
  } = useAppContext();
  const [sentpopup, setsentpopup] = useState(false);
  const [commentside, setcommentside] = useState(false);

  function ClickedComment() {
    if (user) {
    } else {
      setsignup(true);
      setcommentside(false);
    }
  }
  // hide on top at specific height
  useEffect(() => {
    window.onscroll = function () {
      if (this.scrollY >= 444) {
        setup(true);
      } else {
        setup(false);
      }
    };
  });

  // hide on top at specific height

  // coppy url x hide it
  const [copypopup, setcopypopup] = useState(false);

  function copyCodeToClipboard() {
    setcopypopup(true);
    navigator.clipboard.writeText(window.location.toString());
  }
  useEffect(() => {
    const timeId = setTimeout(() => {
      setcopypopup(false);
    }, 3000);
    return () => {
      clearTimeout(timeId);
    };
  });

  // coppy url
  // console.log(post.author.bio);

  const [up, setup] = useState(false);
  const [popup, setPopup] = React.useState(false);

  function InpClicked(e: any) {
    const { name, value } = e.target;
    setemail((prevdata) => {
      return { ...prevdata, [name]: value };
    });
  }
  const [emaila, setemail] = useState({ email: "" });
  const [emailErr, setEmailErr] = useState(false);
  const [subs, setsubs] = useState(false);
  function submit(e: any) {
    e.preventDefault();
    const format = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/g;
    const emailform = document.getElementById("emailinp");
    if (emaila.email.match(format)) {
      addDoc(collection(db, "NewsLetters"), emaila)
        .then(() => {
          setPopup(true);
        })
        .catch((error) => {
          console.log(error.message);
        });
      setsubs(true);
      setemail({ email: "" });
    } else {
      setEmailErr(true);
    }
  }

  /* response / side popup */
  const [response, setresponse] = useState(false);

  /* response / side popup */

  function InpClicked1(e: any) {
    const { name, value } = e.target;

    setCommentfield((prevdata) => {
      return { ...prevdata, [name]: value };
    });
  }

  const [commentfield, setCommentfield] = useState({
    comment: "",
  });
  const [likefield, setlikefield] = useState(0);

  let data = {
    _id: post && post._id,
    name: user && user.displayName,
    email: user && user.email,
    userImage: user && user.photoURL,
    comment: commentfield.comment,
  };
  useEffect(() => {
    setsentpopup(false);
  }, [data._id]);

  async function handleSubmitform(e: any) {
    e.preventDefault();
    setissending(true);
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setsubmited(true);
        setissending(false);
        commentfield.comment = "";
        setsentpopup(true);
      })
      .catch((err) => {
        console.log(err);
        setsubmited(false);
        setsentpopup(false);
      });
  }

  useEffect(() => {
    if (data.comment === "") {
      setresponse(true);
    } else {
      setresponse(false);
    }
  }, [data.comment]);

  // sanity rich text
  const CodeRenderer = ({ node }) => {
    if (!node.code) {
      return null;
    }
    return (
      <SyntaxHighlighter
        className="my-12 lowercase"
        language={node.language || "text"}
      >
        {node.code}
      </SyntaxHighlighter>
    );
  };
  const BlockRenderer = (props: any) => {
    const { style } = props.node;

    if (style === "h1") {
      return (
        <h1 className="text-[30px] font-bold text-gray-900  my-8">
          - {props.children}
        </h1>
      );
    } else if (style === "h2") {
      return (
        <h2 className="text-2xl font-bold text-gray-900  my-5">
          - {props.children}
        </h2>
      );
    } else if (style === "blockquote") {
      return (
        <blockquote className="text-gray-600 my-10 italic border-l-4 border-gray-900 pl-8">
          - {props.children}
        </blockquote>
      );
    }

    // Fall back to default handling
    return BlockContent.defaultSerializers.types.block(props);
  };

  // hide comment x like at specific height
  const { ref: myRef, inView: myelemisvisible } = useInView();
  // hide comment x like at specific height

  const [isopen, setisopen] = React.useState(false);

  const [newsletterpopup, setnewsletterpopup] = useState(false);
  function ClickedMail() {
    const usermail = { userEmail: user?.email };
    if (!user) {
      setsignup(true);
    } else if (user) {
      addDoc(collection(db, "NewsLettersBtn"), usermail)
        .then(() => {
          setnewsletterpopup(true);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }
  const [followed, setfollowed] = useState(false);

  function Clickedfollow() {
    const usermail = { userEmail: user?.email };

    if (user) {
      addDoc(collection(db, "Followed"), usermail)
        .then(() => {
          setfollowed((prev) => !prev);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      setsignup(true);
    }
  }
  return (
    <div>
      <Header />
      <main className="relative isolate mx-auto w-full font-poppins grid grid-cols-7 ">
        {newsletterpopup && (
          <div
            onClick={() => setnewsletterpopup(false)}
            className={`${newsletterpopup
              ? "fixed inset-0 z-10 bg-gray-100   backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
              : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
              }`}
          />
        )}
        <div className="">
          <div
            className={`${newsletterpopup
              ? "fixed scale-100  p-8 flex flex-col justify-center items-center text-center top-1/2 z-50 left-1/2 -translate-x-1/2 -translate-y-1/2    md:z-10 ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto  rounded-lg bg-white shadow-xl"
              : "fixed p-8 flex flex-col justify-center items-center text-center top-1/2 z-50 left-1/2 -translate-x-1/2 -translate-y-1/2  scale-0   md:z-10 ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto  rounded-lg bg-white shadow-xl"
              }`}
          >
            <div
              className="p-4  cursor-pointer  z-50  absolute top-0 pt-10 pr-10 right-0"
              onClick={() => setnewsletterpopup(false)}
            >
              <VscClose className="h-8 w-8  text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
            </div>{" "}
            <div>
              {" "}
              <Image height={260} width={260} src={newslettergif} alt="" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Thank You For Your Subscription
              </h1>

              <h2>
                You will be getting daily news about {post.author.name} posts
              </h2>
              <div className="mt-8">
                <span className="text-black px-8 py-2 rounded-md  bg-green-600">
                  {" "}
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* newsletterpopup */}
        <div className="border-gray-200  border-x-[1px] w-full h-full  col-span-7 xl:col-span-12 ">
          {copypopup && (
            <div className="fixed  m-10 mb-20 sm:mb-10  bottom-0 z-50 right-0 ">
              <div className="bg-gray-900  flex justify-between items-center text-black w-[18rem] md:w-[40rem] h-16 px-8 py-6 rounded-lg shadow-md">
                <h1>Link copied!</h1>
                <VscClose
                  onClick={() => setcopypopup(false)}
                  className="cursor-pointer h-6 w-6"
                />
              </div>
            </div>
          )}
          {up && (
            <div
              onClick={scrolltotop}
              className="fixed hidden sm:block animate-bounce duration-500 z-40 hover:bg-green-700 bg-green-600 shadow-xl cursor-pointer rounded-md p-[13px] m-10 bottom-0 right-0"
            >
              <BiUpArrow className="w-4 h-4 text-black" />
            </div>
          )}
          {/* second section */}
          <div className="block xl:hidden">
            <Header />
          </div>

          {/* bottom section */}
          <div className="w-full   z-50 block sm:hidden px-[30px] py-[20px] fixed bg-gray-100 shadow-md bottom-0">
            <div className="flex justify-between">
              <Link href="/">
                <div>
                  {router.pathname === "/" ? <HomePhone /> : <HomePhone />}
                </div>
              </Link>
              {/* <Home /> */}
              <Link href="/SearchCo">
                <div>
                  <Search />
                </div>
              </Link>
              <Tooltip
                // options
                title="Not working yet"
                position="bottom"
                trigger="mouseenter"
                arrow={true}
                delay={300}
                hideDelay={0}
                distance={20}
              >
                <div>
                  <ReadingList />
                </div>
              </Tooltip>
            </div>
          </div>
          {/* bottom section */}
          <div className="wrapper z-0 mt-24 xl:mt-0 flex flex-col justify-center px-6">

            {/* like x Comment fixed */}

           {/*  <div
              className={`${myelemisvisible
                ? "fixed hidden bottom-20 md:bottom-10 -translate-x-1/2 left-1/2 xl:left-[43%]"
                : "fixed bottom-20 md:bottom-10 -translate-x-1/2 left-1/2 xl:left-[43%]"
                }`}
            >
              <div className="  bg-white px-6 py-2 rounded-full shadow-xl">
                <div className="flex  space-x-8  items-center">
                  {" "}
                  <div className="flex space-x-2 ">
                    <Tooltip
                      // options

                      title="Likes"
                      position="top"
                      trigger="mouseenter"
                      arrow={true}
                      delay={300}
                      hideDelay={0}
                      distance={20}
                    >
                      <div className="flex cursor-not-allowed items-center space-x-2 cursor-pointer">
                        <Like />

                        <span className="text-sm  text-gray-500">
                          {likefield}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex space-x-2">
                    <Tooltip
                      // options
                      title="Respond"
                      position="top"
                      trigger="mouseenter"
                      arrow={true}
                      delay={300}
                      hideDelay={0}
                      distance={20}
                    >
                      <div
                        onClick={() => setcommentside(true)}
                        className="flex space-x-2 items-center cursor-pointer"
                      >
                        <Comment />
                        <span className="text-sm text-gray-500">
                          {post.comments.length}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div> */}

            {/* like x Comment fixed */}

            {/*MainArticle(post, copyCodeToClipboard)*/}
            {newArticle(post, BlockRenderer, CodeRenderer)}


          </div>
        </div>
        {signFunction(sign, setsignup, setsign, signup, signUpWithGoogle, setloginpassword, loginemail, loginpassword, messageerr, messageerr1, messageerr2, setloginemail, signInWithGoogle, registeremail, registerpassword, setregisterpassword, login, successlogin, setregisteremail, handlesubmit)}

        {/* SIGN UP */}
      </main>
      <Footer/>

    </div>
  );
}

const cardInfo = (post) =>
  <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow">
    <a href="#">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {post.title}
      </h5>
    </a>
    <p className="mt-8 mb-8 font-normal">
      {post.smallDescription}
    </p>
    <a
      href="#"
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      à partir de {post.price}€
      <svg
        className="w-3.5 h-3.5 ml-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </a>
  </div>


const cardGoogle = (post) =>
  <div className="p-10 bg-white border border-gray-200 rounded-lg shadow VfPpkd-WsjYwc VfPpkd-WsjYwc-OWXEXe-INsAgc KC1dQ Usd1Ac AaN0Dd ZXnR6e PuR4Qc AlCaFe yAqoCb">
    {" "}
    <h3 className="mb-2 text-xl tracking-tight text-gray-900">Travel.so Suggestion</h3>{" "}
    <div
      className="szUogf"
      data-ved="0CAEQmJMEahgKEwjw2PHwg-SBAxUAAAAAHQAAAAAQ9QE"
    >
      {" "}
      <div className="IhZhl">
        {" "}
        <div className="L9Lk9b fUXBQd">
          {" "}
          <div className="sMSJZb">
            {" "}
            <div className="i7FaDe">
              {" "}
              <div className="N6WNxd P2UJoe" role="presentation" />{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className="frOi8 AdWm1c">

        </div>
      </div>{" "}
      <div className="vx1PSc" />{" "}
      <div className="TesKhb">
        {" "}
        <button
          className="VfPpkd-LgbsSe"
          aria-label="More details"
          aria-expanded="true"
        >
          {" "}
          <div className="VfPpkd-Jh9lGc" />{" "}
          <div className="VfPpkd-J1Ukfc-LhBDec" />{" "}
          <div className="VfPpkd-RLmnJb" />{" "}

          <span className="VfPpkd-vQzf8d" />{" "}
        </button>{" "}
      </div>{" "}
    </div>{" "}
    <div className="j7ZsKe">
      {" "}
      <div className="vy5OIf">
        <div className="RUxA">
          <div className="FxCNRe">
            
            <div className="mXPJje">
              <div className="OLEkCe eUXDc" />
              <div className="zYxc2e eUXDc" />
              <div className="JBTUR eUXDc" />
            </div>
            <div className="s2lHq">
              <div className="OLEkCe XYlWVb sSHqwe">{post.priceRange.low}€</div>
              <div className="JBTUR XYlWVb sSHqwe">{post.priceRange.high}€</div>
            </div>
          </div>
          <div className="NtS4zd eoY5cb">
            <p className="small-text">            Les vols les moins chers pour des voyages similaires à destination de {post.city} sont généralement dans la fourchette de prix de {post.priceRange.low}€ - {post.priceRange.high}€.
            </p>

          </div>
        </div>
      </div>{" "}
    </div>
    <span className="VfPpkd-BFbNVe-bF1uUb NZp2ef" />
  </div>


const headArticle = (post) => <div className="hidden h-full grid-cols-3 md:grid">
  <div className="relative col-span-2 mr-4 cursor-pointer">
    <img
      src={urlForImage(post.mainImage).url()}
      className="aspect-video rounded-xl w-full h-full"
      alt="Wander Yosemite Falls picture"
      style={{ objectFit: "cover" }}
    />
  </div>
  <div className="flex flex-col">
    <div className="relative aspect-video cursor-pointer">
      {cardInfo(post)}

    </div>
    <div className="relative aspect-video cursor-pointer">
      {cardGoogle(post)}
    </div>
  </div>
</div>



const pointsForts = <div className="mb-16">
  <div className="mb-6">
    <div className="text-2xl font-bold">
      Points Forts
    </div>
  </div>
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M6.75 20.25C6.75 20.25 3.75 16.5 6.75 12C9.75 7.5 6.75 3.75 6.75 3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 20.25C12 20.25 9.00001 16.5 12 12C15 7.5 12 3.75 12 3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.25 20.25C17.25 20.25 14.25 16.5 17.25 12C20.25 7.5 17.25 3.75 17.25 3.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Sauna</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M22 21L15.3833 8.53125C15.2099 8.20436 14.8701 8 14.5 8C14.1299 8 13.7901 8.20436 13.6167 8.53125L7 21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21H1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.43506 4.51856C9.35978 4.61468 10.0468 5.4188 9.99748 6.34719C9.94813 7.27558 9.1797 8.00233 8.25 7.99988H4.5C3.67157 7.99988 3 7.32831 3 6.49988C3 5.67145 3.67157 4.99988 4.5 4.99988C4.49826 3.98965 5.25139 3.13732 6.25414 3.01467C7.2569 2.89202 8.19325 3.5377 8.43506 4.51856Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.95966 15.4228L8.378 12.5214C8.20283 12.2 7.86604 12 7.5 12C7.13396 12 6.79717 12.2 6.622 12.5214L2 21.0001"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.0866 11.1406C16.0866 11.1406 17.9 13.1615 16.0866 15.5866C14.2733 18.0116 16.0866 20.0325 16.0866 20.0325"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.9133 11.1406C12.9133 11.1406 14.7267 13.1615 12.9133 15.5866C11.1 18.0116 12.9133 20.0325 12.9133 20.0325"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Creek</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M14.7273 17.7273L6.27273 9.27274"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.483 5.48291C11.5619 2.40405 16.304 2.15436 19.0748 4.92517C21.8456 7.69598 21.596 12.4382 18.5171 15.517"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.483 5.48291C6.15443 7.69245 5.40714 11.0978 6.59655 14.0794C6.76747 14.496 6.6311 14.9756 6.26648 15.2399L3.8 17.0897C3.33616 17.4376 3.04612 17.9697 3.00503 18.548C2.96394 19.1263 3.17584 19.694 3.58583 20.104L3.89604 20.4142C4.30601 20.8242 4.87371 21.0361 5.45203 20.995C6.03035 20.9539 6.56238 20.6638 6.91025 20.2L8.76012 17.7335C9.02451 17.3689 9.50404 17.2326 9.9207 17.4035C12.9022 18.5929 16.3075 17.8455 18.517 15.517"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Ping pong table</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M11.999 19.25C11.792 19.25 11.624 19.418 11.626 19.625C11.625 19.832 11.793 20 12 20C12.207 20 12.375 19.832 12.375 19.625C12.375 19.418 12.207 19.25 11.999 19.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.591 12C8.683 8.24699 15.316 8.24699 19.408 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.594 7.804C7.341 2.732 16.659 2.732 22.406 7.804"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.579 15.821C10.02 13.393 13.979 13.393 16.42 15.821"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Wifi</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.5 19H17.5C17.2239 19 17 18.7761 17 18.5V15.3333C17 14.597 17.597 14 18.3333 14H19.6667C20.0203 14 20.3594 14.1405 20.6095 14.3905C20.8595 14.6406 21 14.9797 21 15.3333V18.5C21 18.7761 20.7761 19 20.5 19Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.5 6H8.5C8.77614 6 9 6.22386 9 6.5V10C9 11.1046 8.10457 12 7 12H5C3.89543 12 3 11.1046 3 10V6.5C3 6.22386 3.22386 6 3.5 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 6V3.5C4 3.22386 4.22386 3 4.5 3H7.5C7.77614 3 8 3.22386 8 3.5V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 21V19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 14V6C19 4.34315 17.6569 3 16 3V3C14.3431 3 13 4.34315 13 6V17.5C13 19.433 11.433 21 9.5 21V21C7.567 21 6 19.433 6 17.5V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>EV Charger</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse
            cx={17}
            cy="8.99993"
            rx="4.99997"
            ry="5.99996"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.82844 12.5354C9.17932 13.4539 8.12468 13.9999 7.00003 13.9999C5.87538 13.9999 4.82075 13.4539 4.17162 12.5354C2.60954 10.4373 2.60954 7.56263 4.17162 5.46443C4.82075 4.54603 5.87538 3.99997 7.00003 3.99997C8.12468 3.99997 9.17932 4.54603 9.82844 5.46443"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.00003 17.9999V9.99994"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 17.9997V8.99979"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.9999 17.9999H3.00006"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.5 20.9999H12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.7353 20.9999H16.7353"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 20.9999H20.9999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.00006 20.9999H4.00005"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.26474 20.9999H8.26473"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Garden</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12.0009 20L14.2393 7.35731C16.3728 7.35731 17.0458 7.59227 17.143 8.55131C17.143 8.55131 18.5742 8.01537 19.2961 6.92687C16.4792 5.61596 13.6488 5.55684 13.6488 5.55684L11.9972 7.57707L12.0009 7.57681L10.3493 5.55652C10.3493 5.55652 7.51884 5.6157 4.70226 6.92661C5.4235 8.01511 6.85533 8.55106 6.85533 8.55106C6.95306 7.59196 7.62522 7.357 9.74447 7.35547L12.0009 20Z"
            fill="currentColor"
          />
          <path
            d="M12 4.9733C14.2771 4.95581 16.8835 5.32707 19.5517 6.49497C19.9083 5.85035 20 5.56545 20 5.56545C17.0833 4.40656 14.3518 4.00995 11.9997 4C9.64767 4.00995 6.91634 4.40662 4 5.56545C4 5.56545 4.1301 5.91637 4.44798 6.49497C7.11565 5.32707 9.72251 4.95581 11.9997 4.9733H12Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div>
        <div>Tesla</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 21H18.779C19.884 21 20.779 20.105 20.779 19V5C20.779 3.895 19.884 3 18.779 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.78 8H3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.536 16.5V16.5C8.035 15.632 8.29 14.525 9.12 13.964L9.121 13.963C9.787 13.512 10.664 13.527 11.314 14L12.686 14.999C13.336 15.472 14.213 15.487 14.879 15.036L14.88 15.035C15.71 14.474 15.964 13.367 15.464 12.499V12.499"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.8284 11.6716C16.3905 13.2337 16.3905 15.7664 14.8284 17.3285C13.2663 18.8906 10.7336 18.8906 9.17155 17.3285C7.60945 15.7664 7.60945 13.2337 9.17155 11.6716C10.7337 10.1095 13.2663 10.1095 14.8284 11.6716"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 5.5H18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Dryer</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx={12}
            cy={12}
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x={2}
            y={2}
            width={20}
            height={20}
            rx="5.55556"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.8689 10.3548C14.0538 9.68261 14.4992 9.11194 15.1064 8.76925C15.7135 8.42655 16.4322 8.34015 17.1033 8.52917C17.9644 8.76539 18.6416 9.4311 18.8925 10.2881C19.1225 11.0617 18.9857 11.898 18.5212 12.558C18.3298 12.8182 18.0276 12.9738 17.7046 12.9785C17.3815 12.9832 17.0749 12.8365 16.876 12.582C16.2507 11.7811 15.3379 11.2553 14.3313 11.1163"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.1165 9.66864C11.2554 8.66209 11.7811 7.7493 12.582 7.124C12.8365 6.92507 12.9833 6.61848 12.9786 6.29546C12.9739 5.97245 12.8183 5.67025 12.5581 5.4788C11.898 5.01435 11.0617 4.87758 10.2881 5.10758C9.43109 5.3584 8.76538 6.03554 8.52917 6.89667C8.34016 7.56772 8.42657 8.28644 8.76925 8.89358C9.11192 9.50071 9.68257 9.94611 10.3547 10.1311"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.8835 14.3314C12.7446 15.3379 12.2189 16.2507 11.418 16.876C11.1635 17.0749 11.0167 17.3815 11.0214 17.7045C11.0261 18.0275 11.1817 18.3297 11.4419 18.5211C12.102 18.9856 12.9383 19.1224 13.7119 18.8924C14.5689 18.6416 15.2346 17.9644 15.4708 17.1033C15.6599 16.4322 15.5735 15.7135 15.2308 15.1063C14.8881 14.4992 14.3175 14.0538 13.6453 13.8688"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.6687 12.8835C8.66212 12.7446 7.7493 12.2189 7.124 11.418C6.92503 11.1635 6.61843 11.0168 6.29541 11.0215C5.97239 11.0262 5.6702 11.1818 5.47874 11.442C5.01424 12.102 4.87746 12.9384 5.10752 13.7119C5.35839 14.5689 6.03556 15.2347 6.89671 15.4709C7.56777 15.6599 8.28651 15.5735 8.89365 15.2308C9.50078 14.8881 9.94617 14.3174 10.1311 13.6452"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Air conditioning</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x={3}
            y={8}
            width={13}
            height={13}
            rx={3}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 8V6C8 4.34315 9.34315 3 11 3H18C19.6569 3 21 4.34315 21 6V13C21 14.6569 19.6569 16 18 16H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.8755 11C12.9445 11.0003 13.0002 11.0563 13 11.1253C12.9998 11.1943 12.9438 11.2501 12.8748 11.25C12.8059 11.2499 12.75 11.194 12.75 11.125C12.7498 11.0917 12.763 11.0597 12.7866 11.0362C12.8102 11.0127 12.8422 10.9997 12.8755 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.50048 14.375C9.56945 14.3753 9.62518 14.4313 9.625 14.5003C9.62482 14.5693 9.56881 14.6251 9.49984 14.625C9.43087 14.6249 9.375 14.569 9.375 14.5C9.37482 14.4667 9.388 14.4347 9.41159 14.4112C9.43517 14.3878 9.46719 14.3747 9.50048 14.375"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.1255 17.75C6.19447 17.7503 6.25018 17.8064 6.25 17.8753C6.24982 17.9443 6.1938 18.0001 6.12483 18C6.05586 17.9999 6 17.944 6 17.875C5.99982 17.8417 6.013 17.8097 6.03659 17.7862C6.06017 17.7628 6.09219 17.7497 6.12548 17.75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.75 17.8745C12.7503 17.8055 12.8063 17.7498 12.8753 17.75C12.9443 17.7502 13.0001 17.8062 13 17.8752C12.9999 17.9441 12.944 18 12.875 18C12.8417 18.0002 12.8097 17.987 12.7862 17.9634C12.7627 17.9398 12.7497 17.9078 12.75 17.8745"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.12454 11C6.05557 11.0003 5.99984 11.0563 6.00002 11.1253C6.0002 11.1943 6.05621 11.2501 6.12518 11.25C6.19415 11.2499 6.25002 11.194 6.25002 11.125C6.2502 11.0917 6.23702 11.0597 6.21343 11.0362C6.18985 11.0128 6.15783 10.9997 6.12454 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.8745 6.25C17.8055 6.24972 17.7498 6.19364 17.75 6.12466C17.7502 6.05569 17.8062 5.99991 17.8752 6C17.9441 6.00009 18 6.05603 18 6.125C18.0002 6.15829 17.987 6.19026 17.9634 6.21375C17.9398 6.23725 17.9078 6.2503 17.8745 6.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Board games</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.9779 7.38446L16.6151 10.0217L10.0214 16.6153L7.38421 13.9781L13.9779 7.38446Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.42856 11.3403C3.79253 10.9764 4.38264 10.9764 4.74661 11.3403L12.6594 19.2532C13.0234 19.6171 13.0234 20.2072 12.6594 20.5712L11.9996 21.2311C11.6356 21.595 11.0455 21.595 10.6815 21.2311L2.76871 13.3182C2.40474 12.9543 2.40474 12.3641 2.76871 12.0002L3.42856 11.3403Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.42873 15.2971C3.7927 14.9331 4.38281 14.9331 4.74678 15.2971L8.70382 19.2541C9.06779 19.6181 9.06779 20.2082 8.70382 20.5721L8.04398 21.232C7.68001 21.596 7.0899 21.596 6.72593 21.232L2.76888 17.2749C2.40491 16.911 2.40491 16.3209 2.76888 15.9569L3.42873 15.2971Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.5712 12.6604C20.2072 13.0243 19.6171 13.0243 19.2531 12.6604L11.3403 4.74754C10.9763 4.38357 10.9763 3.79346 11.3403 3.42949L12.0001 2.76965C12.3641 2.40568 12.9542 2.40568 13.3182 2.76965L21.231 10.6825C21.595 11.0464 21.595 11.6366 21.231 12.0005L20.5712 12.6604Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.5715 8.70295C20.2075 9.06691 19.6174 9.06691 19.2534 8.70295L15.2964 4.7459C14.9324 4.38193 14.9324 3.79182 15.2964 3.42785L15.9562 2.76801C16.3202 2.40404 16.9103 2.40404 17.2743 2.76801L21.2313 6.72505C21.5953 7.08902 21.5953 7.67913 21.2313 8.0431L20.5715 8.70295Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Gym</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M16.752 19.5031H8.99875"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.78478 15.6432L7.97209 18.0812"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="7.49813"
            cy="19.5031"
            r="1.50063"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.2465 15.6318L17.3356 21.0037"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.99708 7.99832H19.0029C19.5554 7.99832 20.0033 8.44622 20.0033 8.99874V8.99874C20.0033 12.3138 17.3159 15.0012 14.0008 15.0012H9.99917C6.68408 15.0012 3.99667 12.3138 3.99667 8.99874V8.99874C3.99667 8.44622 4.44457 7.99832 4.99708 7.99832Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.24844 4.99707C7.91497 4.55244 7.91497 3.94107 8.24844 3.49644C8.58191 3.05181 8.58191 2.44045 8.24844 1.99582"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.7516 4.99707C15.4181 4.55244 15.4181 3.94107 15.7516 3.49644C16.085 3.05181 16.085 2.44045 15.7516 1.99582"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 4.99707C11.6665 4.55244 11.6665 3.94107 12 3.49644C12.3335 3.05181 12.3335 2.44045 12 1.99582"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>BBQ Area</div>
      </div>
    </div>
    <div className="flex">
      <div className="mr-2 text-lg text-4-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 5V3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 13H4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 6L6 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 6L18 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 13H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 13C17 10.239 14.771 8 12.022 8H11.978C9.229 8 7 10.239 7 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 17H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div>Waterfront</div>
      </div>
    </div>
  </div>
</div>

const location = <div className="mb-16">
  <div className="text-eyebrow-medium text-black/60">Location</div>
  <div className="mb-6 text-2xl font-bold">Oakhurst, California</div>
  <div className="relative mb-4 h-44 w-full overflow-hidden rounded-lg lg:h-72 lg:w-full">
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "rgb(229, 227, 223)"
        }}
      >
        <div
          className="gm-style"
          style={{
            position: "absolute",
            zIndex: 0,
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            padding: 0,
            borderWidth: 0,
            margin: 0
          }}
        >
          <div>
            <button
              draggable="false"
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts"
              type="button"
              style={{
                background: "none transparent",
                display: "block",
                border: "none",
                margin: 0,
                padding: 0,
                textTransform: "none",
                appearance: "none",
                position: "absolute",
                cursor: "pointer",
                userSelect: "none",
                zIndex: 1000002,
                outlineOffset: 3,
                right: 0,
                bottom: 0,
                transform: "translateX(100%)"
              }}
            />
          </div>
          <div
            tabIndex={0}
            aria-label="Map"
            aria-roledescription="map"
            role="region"
            style={{
              position: "absolute",
              zIndex: 0,
              left: 0,
              top: 0,
              height: "100%",
              width: "100%",
              padding: 0,
              borderWidth: 0,
              margin: 0,
              cursor:
                'url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default',
              touchAction: "pan-x pan-y"
            }}
            aria-describedby="4C22FE59-F959-402D-9432-CA2A8AA461E5"
          >
            <div
              style={{
                zIndex: 1,
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100%",
                willChange: "transform",
                transform: "translate(0px, 0px)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 100,
                  width: "100%"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 0
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 986,
                      transform: "matrix(1, 0, 0, 1, -133, -65)"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: "-256px",
                        top: 0,
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: "-256px",
                        top: "-256px",
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "-256px",
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 256,
                        top: "-256px",
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: 256,
                        top: 0,
                        width: 256,
                        height: 256
                      }}
                    >
                      <div style={{ width: 256, height: 256 }} />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 101,
                  width: "100%"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 102,
                  width: "100%"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  zIndex: 103,
                  width: "100%"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: -1
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 986,
                      transform: "matrix(1, 0, 0, 1, -133, -65)"
                    }}
                  >
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: 0,
                        top: 0
                      }}
                    />
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: "-256px",
                        top: 0
                      }}
                    />
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: "-256px",
                        top: "-256px"
                      }}
                    />
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: 0,
                        top: "-256px"
                      }}
                    />
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: 256,
                        top: "-256px"
                      }}
                    />
                    <div
                      style={{
                        width: 256,
                        height: 256,
                        overflow: "hidden",
                        position: "absolute",
                        left: 256,
                        top: 0
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: 56,
                    height: 61,
                    overflow: "hidden",
                    position: "absolute",
                    left: "-28px",
                    top: "-61px",
                    zIndex: 0
                  }}
                >
                  <img
                    alt=""
                    src="/images/property/marker.png"
                    draggable="false"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      userSelect: "none",
                      width: 56,
                      height: 61,
                      border: 0,
                      padding: 0,
                      margin: 0,
                      maxWidth: "none"
                    }}
                  />
                </div>
              </div>
              <div
                style={{ position: "absolute", left: 0, top: 0, zIndex: 0 }}
              >
                <div
                  style={{
                    position: "absolute",
                    zIndex: 986,
                    transform: "matrix(1, 0, 0, 1, -133, -65)"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-256px",
                      top: "-256px",
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2746!3i6355!4i256!2m3!1e0!2sm!3i665406029!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=119363"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2747!3i6356!4i256!2m3!1e0!2sm!3i665406173!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=32184"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 256,
                      top: "-256px",
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2748!3i6355!4i256!2m3!1e0!2sm!3i665406029!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=61888"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 256,
                      top: 0,
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2748!3i6356!4i256!2m3!1e0!2sm!3i665406221!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=91383"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "-256px",
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2747!3i6355!4i256!2m3!1e0!2sm!3i665406029!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=25090"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: "-256px",
                      top: 0,
                      width: 256,
                      height: 256,
                      transition: "opacity 200ms linear 0s"
                    }}
                  >
                    <img
                      draggable="false"
                      alt=""
                      role="presentation"
                      src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i14!2i2746!3i6356!4i256!2m3!1e0!2sm!3i665406173!3m12!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0!5m1!5f2&key=AIzaSyD_EtUOKEmLN2aJ1iOc-Di0nsUEejlddNA&token=126457"
                      style={{
                        width: 256,
                        height: 256,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                zIndex: 3,
                position: "absolute",
                height: "100%",
                width: "100%",
                padding: 0,
                borderWidth: 0,
                margin: 0,
                left: 0,
                top: 0,
                touchAction: "pan-x pan-y"
              }}
            >
              <div
                style={{
                  zIndex: 4,
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "100%",
                  willChange: "transform",
                  transform: "translate(0px, 0px)"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 104,
                    width: "100%"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 105,
                    width: "100%"
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 106,
                    width: "100%"
                  }}
                >
                  <span
                    id="9588D1AB-1C8F-40F4-A89C-F105572D0603"
                    style={{ display: "none" }}
                  >
                    To navigate, press the arrow keys.
                  </span>
                  <div
                    title=""
                    tabIndex={-1}
                    style={{
                      width: 56,
                      height: 61,
                      overflow: "hidden",
                      position: "absolute",
                      cursor: "pointer",
                      touchAction: "none",
                      left: "-28px",
                      top: "-61px",
                      zIndex: 0
                    }}
                  >
                    <img
                      alt=""
                      src="https://maps.gstatic.com/mapfiles/transparent.png"
                      draggable="false"
                      style={{
                        width: 56,
                        height: 61,
                        userSelect: "none",
                        border: 0,
                        padding: 0,
                        margin: 0,
                        maxWidth: "none"
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 107,
                    width: "100%"
                  }}
                />
              </div>
            </div>
            <div
              className="gm-style-moc"
              style={{
                zIndex: 4,
                position: "absolute",
                height: "100%",
                width: "100%",
                padding: 0,
                borderWidth: 0,
                margin: 0,
                left: 0,
                top: 0,
                opacity: 0
              }}
            >
              <p className="gm-style-mot" />
            </div>
            <div
              className="LGLeeN-keyboard-shortcuts-view"
              id="4C22FE59-F959-402D-9432-CA2A8AA461E5"
              style={{ display: "none" }}
            >
              <table>
                <tbody>
                  <tr>
                    <td>
                      <kbd aria-label="Left arrow">←</kbd>
                    </td>
                    <td aria-label="Move left.">Move left</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd aria-label="Right arrow">→</kbd>
                    </td>
                    <td aria-label="Move right.">Move right</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd aria-label="Up arrow">↑</kbd>
                    </td>
                    <td aria-label="Move up.">Move up</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd aria-label="Down arrow">↓</kbd>
                    </td>
                    <td aria-label="Move down.">Move down</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>+</kbd>
                    </td>
                    <td aria-label="Zoom in.">Zoom in</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>-</kbd>
                    </td>
                    <td aria-label="Zoom out.">Zoom out</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>Home</kbd>
                    </td>
                    <td aria-label="Jump left by 75%.">Jump left by 75%</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>End</kbd>
                    </td>
                    <td aria-label="Jump right by 75%.">
                      Jump right by 75%
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>Page Up</kbd>
                    </td>
                    <td aria-label="Jump up by 75%.">Jump up by 75%</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd>Page Down</kbd>
                    </td>
                    <td aria-label="Jump down by 75%.">Jump down by 75%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <iframe
            aria-hidden="true"
            frameBorder={0}
            tabIndex={-1}
            style={{
              zIndex: -1,
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: "none"
            }}
          />
          <div
            style={{
              pointerEvents: "none",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              position: "absolute",
              zIndex: 1000002,
              opacity: 0,
              border: "2px solid rgb(26, 115, 232)"
            }}
          />
          <div />
          <div />
          <div />
          <div />
          <div>
            <button
              draggable="false"
              aria-label="Toggle fullscreen view"
              title="Toggle fullscreen view"
              type="button"
              aria-pressed="false"
              className="gm-control-active gm-fullscreen-control"
              style={{
                background: "none rgb(255, 255, 255)",
                border: 0,
                margin: 10,
                padding: 0,
                textTransform: "none",
                appearance: "none",
                position: "absolute",
                cursor: "pointer",
                userSelect: "none",
                borderRadius: 2,
                height: 40,
                width: 40,
                boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px",
                overflow: "hidden",
                top: 0,
                right: 0
              }}
            >
              <img
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
                alt=""
                style={{ height: 18, width: 18 }}
              />
              <img
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
                alt=""
                style={{ height: 18, width: 18 }}
              />
              <img
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
                alt=""
                style={{ height: 18, width: 18 }}
              />
            </button>
          </div>
          <div />
          <div />
          <div />
          <div />
          <div>
            <div
              className="gmnoprint gm-bundled-control gm-bundled-control-on-bottom"
              draggable="false"
              data-control-width={40}
              data-control-height={81}
              style={{
                margin: 10,
                userSelect: "none",
                position: "absolute",
                bottom: 95,
                right: 40
              }}
            >
              <div
                className="gmnoprint"
                data-control-width={40}
                data-control-height={40}
                style={{ display: "none", position: "absolute" }}
              >
                <div
                  style={{
                    backgroundColor: "rgb(255, 255, 255)",
                    boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px",
                    borderRadius: 2,
                    width: 40,
                    height: 40
                  }}
                >
                  <button
                    draggable="false"
                    aria-label="Rotate map clockwise"
                    title="Rotate map clockwise"
                    type="button"
                    className="gm-control-active"
                    style={{
                      background: "none",
                      display: "none",
                      border: 0,
                      margin: 0,
                      padding: 0,
                      textTransform: "none",
                      appearance: "none",
                      position: "relative",
                      cursor: "pointer",
                      userSelect: "none",
                      left: 0,
                      top: 0,
                      overflow: "hidden",
                      width: 40,
                      height: 40
                    }}
                  >
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: 30,
                      height: 1,
                      margin: "0px 5px",
                      backgroundColor: "rgb(230, 230, 230)",
                      display: "none"
                    }}
                  />
                  <button
                    draggable="false"
                    aria-label="Rotate map counterclockwise"
                    title="Rotate map counterclockwise"
                    type="button"
                    className="gm-control-active"
                    style={{
                      background: "none",
                      display: "none",
                      border: 0,
                      margin: 0,
                      padding: 0,
                      textTransform: "none",
                      appearance: "none",
                      position: "relative",
                      cursor: "pointer",
                      userSelect: "none",
                      left: 0,
                      top: 0,
                      overflow: "hidden",
                      width: 40,
                      height: 40,
                      transform: "scaleX(-1)"
                    }}
                  >
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M0%200h24v24H0V0z%22/%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M12.06%209.06l4-4-4-4-1.41%201.41%201.59%201.59h-.18c-2.3%200-4.6.88-6.35%202.64-3.52%203.51-3.52%209.21%200%2012.72%201.5%201.5%203.4%202.36%205.36%202.58v-2.02c-1.44-.21-2.84-.86-3.95-1.97-2.73-2.73-2.73-7.17%200-9.9%201.37-1.37%203.16-2.05%204.95-2.05h.17l-1.59%201.59%201.41%201.41zm8.94%203c-.19-1.74-.88-3.32-1.91-4.61l-1.43%201.43c.69.92%201.15%202%201.32%203.18H21zm-7.94%207.92V22c1.74-.19%203.32-.88%204.61-1.91l-1.43-1.43c-.91.68-2%201.15-3.18%201.32zm4.6-2.74l1.43%201.43c1.04-1.29%201.72-2.88%201.91-4.61h-2.02c-.17%201.18-.64%202.27-1.32%203.18z%22/%3E%3C/svg%3E"
                      style={{ width: 20, height: 20 }}
                    />
                  </button>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: 30,
                      height: 1,
                      margin: "0px 5px",
                      backgroundColor: "rgb(230, 230, 230)",
                      display: "none"
                    }}
                  />
                  <button
                    draggable="false"
                    aria-label="Tilt map"
                    title="Tilt map"
                    type="button"
                    className="gm-tilt gm-control-active"
                    style={{
                      background: "none",
                      display: "block",
                      border: 0,
                      margin: 0,
                      padding: 0,
                      textTransform: "none",
                      appearance: "none",
                      position: "relative",
                      cursor: "pointer",
                      userSelect: "none",
                      top: 0,
                      left: 0,
                      overflow: "hidden",
                      width: 40,
                      height: 40
                    }}
                  >
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2016%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M0%2016h8V9H0v7zm10%200h8V9h-8v7zM0%207h8V0H0v7zm10-7v7h8V0h-8z%22/%3E%3C/svg%3E"
                      style={{ width: 18 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2016%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M0%2016h8V9H0v7zm10%200h8V9h-8v7zM0%207h8V0H0v7zm10-7v7h8V0h-8z%22/%3E%3C/svg%3E"
                      style={{ width: 18 }}
                    />
                    <img
                      alt=""
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2016%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M0%2016h8V9H0v7zm10%200h8V9h-8v7zM0%207h8V0H0v7zm10-7v7h8V0h-8z%22/%3E%3C/svg%3E"
                      style={{ width: 18 }}
                    />
                  </button>
                </div>
              </div>
              <div
                className="gmnoprint"
                data-control-width={40}
                data-control-height={81}
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                <div
                  draggable="false"
                  style={{
                    userSelect: "none",
                    boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: "rgb(255, 255, 255)",
                    width: 40,
                    height: 81
                  }}
                >
                  <button
                    draggable="false"
                    aria-label="Zoom in"
                    title="Zoom in"
                    type="button"
                    className="gm-control-active"
                    style={{
                      background: "none",
                      display: "block",
                      border: 0,
                      margin: 0,
                      padding: 0,
                      textTransform: "none",
                      appearance: "none",
                      position: "relative",
                      cursor: "pointer",
                      userSelect: "none",
                      overflow: "hidden",
                      width: 40,
                      height: 40,
                      top: 0,
                      left: 0
                    }}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M18%207h-7V0H7v7H0v4h7v7h4v-7h7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M18%207h-7V0H7v7H0v4h7v7h4v-7h7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M18%207h-7V0H7v7H0v4h7v7h4v-7h7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23d1d1d1%22%20d%3D%22M18%207h-7V0H7v7H0v4h7v7h4v-7h7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                  </button>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: 30,
                      height: 1,
                      margin: "0px 5px",
                      backgroundColor: "rgb(230, 230, 230)",
                      top: 0
                    }}
                  />
                  <button
                    draggable="false"
                    aria-label="Zoom out"
                    title="Zoom out"
                    type="button"
                    className="gm-control-active"
                    style={{
                      background: "none",
                      display: "block",
                      border: 0,
                      margin: 0,
                      padding: 0,
                      textTransform: "none",
                      appearance: "none",
                      position: "relative",
                      cursor: "pointer",
                      userSelect: "none",
                      overflow: "hidden",
                      width: 40,
                      height: 40,
                      top: 0,
                      left: 0
                    }}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M0%207h18v4H0V7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M0%207h18v4H0V7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M0%207h18v4H0V7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                    <img
                      src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23d1d1d1%22%20d%3D%22M0%207h18v4H0V7z%22/%3E%3C/svg%3E"
                      alt=""
                      style={{ height: 18, width: 18 }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                margin: "0px 5px",
                zIndex: 1000000,
                position: "absolute",
                left: 0,
                bottom: 0
              }}
            >
              <a
                target="_blank"
                rel="noopener"
                title="Open this area in Google Maps (opens a new window)"
                aria-label="Open this area in Google Maps (opens a new window)"
                href="https://maps.google.com/maps?ll=37.365718,-119.629678&z=14&t=m&hl=en&gl=US&mapclient=apiv3"
                style={{ display: "inline" }}
              >
                <div style={{ width: 66, height: 26 }}>
                  <img
                    alt="Google"
                    src="data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2069%2029%22%3E%3Cg%20opacity%3D%22.6%22%20fill%3D%22%23fff%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M17.4706%207.33616L18.0118%206.79504%2017.4599%206.26493C16.0963%204.95519%2014.2582%203.94522%2011.7008%203.94522c-4.613699999999999%200-8.50262%203.7551699999999997-8.50262%208.395779999999998C3.19818%2016.9817%207.0871%2020.7368%2011.7008%2020.7368%2014.1712%2020.7368%2016.0773%2019.918%2017.574%2018.3689%2019.1435%2016.796%2019.5956%2014.6326%2019.5956%2012.957%2019.5956%2012.4338%2019.5516%2011.9316%2019.4661%2011.5041L19.3455%2010.9012H10.9508V14.4954H15.7809C15.6085%2015.092%2015.3488%2015.524%2015.0318%2015.8415%2014.403%2016.4629%2013.4495%2017.1509%2011.7008%2017.1509%209.04835%2017.1509%206.96482%2015.0197%206.96482%2012.341%206.96482%209.66239%209.04835%207.53119%2011.7008%207.53119%2013.137%207.53119%2014.176%208.09189%2014.9578%208.82348L15.4876%209.31922%2016.0006%208.80619%2017.4706%207.33616z%22/%3E%3Cpath%20d%3D%22M24.8656%2020.7286C27.9546%2020.7286%2030.4692%2018.3094%2030.4692%2015.0594%2030.4692%2011.7913%2027.953%209.39011%2024.8656%209.39011%2021.7783%209.39011%2019.2621%2011.7913%2019.2621%2015.0594c0%203.25%202.514499999999998%205.6692%205.6035%205.6692zM24.8656%2012.8282C25.8796%2012.8282%2026.8422%2013.6652%2026.8422%2015.0594%2026.8422%2016.4399%2025.8769%2017.2905%2024.8656%2017.2905%2023.8557%2017.2905%2022.8891%2016.4331%2022.8891%2015.0594%2022.8891%2013.672%2023.853%2012.8282%2024.8656%2012.8282z%22/%3E%3Cpath%20d%3D%22M35.7511%2017.2905v0H35.7469C34.737%2017.2905%2033.7703%2016.4331%2033.7703%2015.0594%2033.7703%2013.672%2034.7343%2012.8282%2035.7469%2012.8282%2036.7608%2012.8282%2037.7234%2013.6652%2037.7234%2015.0594%2037.7234%2016.4439%2036.7554%2017.2962%2035.7511%2017.2905zM35.7387%2020.7286C38.8277%2020.7286%2041.3422%2018.3094%2041.3422%2015.0594%2041.3422%2011.7913%2038.826%209.39011%2035.7387%209.39011%2032.6513%209.39011%2030.1351%2011.7913%2030.1351%2015.0594%2030.1351%2018.3102%2032.6587%2020.7286%2035.7387%2020.7286z%22/%3E%3Cpath%20d%3D%22M51.953%2010.4357V9.68573H48.3999V9.80826C47.8499%209.54648%2047.1977%209.38187%2046.4808%209.38187%2043.5971%209.38187%2041.0168%2011.8998%2041.0168%2015.0758%2041.0168%2017.2027%2042.1808%2019.0237%2043.8201%2019.9895L43.7543%2020.0168%2041.8737%2020.797%2041.1808%2021.0844%2041.4684%2021.7772C42.0912%2023.2776%2043.746%2025.1469%2046.5219%2025.1469%2047.9324%2025.1469%2049.3089%2024.7324%2050.3359%2023.7376%2051.3691%2022.7367%2051.953%2021.2411%2051.953%2019.2723v-8.8366zm-7.2194%209.9844L44.7334%2020.4196C45.2886%2020.6201%2045.878%2020.7286%2046.4808%2020.7286%2047.1616%2020.7286%2047.7866%2020.5819%2048.3218%2020.3395%2048.2342%2020.7286%2048.0801%2021.0105%2047.8966%2021.2077%2047.6154%2021.5099%2047.1764%2021.7088%2046.5219%2021.7088%2045.61%2021.7088%2045.0018%2021.0612%2044.7336%2020.4201zM46.6697%2012.8282C47.6419%2012.8282%2048.5477%2013.6765%2048.5477%2015.084%2048.5477%2016.4636%2047.6521%2017.2987%2046.6697%2017.2987%2045.6269%2017.2987%2044.6767%2016.4249%2044.6767%2015.084%2044.6767%2013.7086%2045.6362%2012.8282%2046.6697%2012.8282zM55.7387%205.22083v-.75H52.0788V20.4412H55.7387V5.220829999999999z%22/%3E%3Cpath%20d%3D%22M63.9128%2016.0614L63.2945%2015.6492%2062.8766%2016.2637C62.4204%2016.9346%2061.8664%2017.3069%2061.0741%2017.3069%2060.6435%2017.3069%2060.3146%2017.2088%2060.0544%2017.0447%2059.9844%2017.0006%2059.9161%2016.9496%2059.8498%2016.8911L65.5497%2014.5286%2066.2322%2014.2456%2065.9596%2013.5589%2065.7406%2013.0075C65.2878%2011.8%2063.8507%209.39832%2060.8278%209.39832%2057.8445%209.39832%2055.5034%2011.7619%2055.5034%2015.0676%2055.5034%2018.2151%2057.8256%2020.7369%2061.0659%2020.7369%2063.6702%2020.7369%2065.177%2019.1378%2065.7942%2018.2213L66.2152%2017.5963%2065.5882%2017.1783%2063.9128%2016.0614zM61.3461%2012.8511L59.4108%2013.6526C59.7903%2013.0783%2060.4215%2012.7954%2060.9017%2012.7954%2061.067%2012.7954%2061.2153%2012.8161%2061.3461%2012.8511z%22/%3E%3C/g%3E%3Cpath%20d%3D%22M11.7008%2019.9868C7.48776%2019.9868%203.94818%2016.554%203.94818%2012.341%203.94818%208.12803%207.48776%204.69522%2011.7008%204.69522%2014.0331%204.69522%2015.692%205.60681%2016.9403%206.80583L15.4703%208.27586C14.5751%207.43819%2013.3597%206.78119%2011.7008%206.78119%208.62108%206.78119%206.21482%209.26135%206.21482%2012.341%206.21482%2015.4207%208.62108%2017.9009%2011.7008%2017.9009%2013.6964%2017.9009%2014.8297%2017.0961%2015.5606%2016.3734%2016.1601%2015.7738%2016.5461%2014.9197%2016.6939%2013.7454h-4.9931V11.6512h7.0298C18.8045%2012.0207%2018.8456%2012.4724%2018.8456%2012.957%2018.8456%2014.5255%2018.4186%2016.4637%2017.0389%2017.8434%2015.692%2019.2395%2013.9838%2019.9868%2011.7008%2019.9868z%22%20fill%3D%22%234285F4%22/%3E%3Cpath%20d%3D%22M29.7192%2015.0594C29.7192%2017.8927%2027.5429%2019.9786%2024.8656%2019.9786%2022.1884%2019.9786%2020.0121%2017.8927%2020.0121%2015.0594%2020.0121%2012.2096%2022.1884%2010.1401%2024.8656%2010.1401%2027.5429%2010.1401%2029.7192%2012.2096%2029.7192%2015.0594zM27.5922%2015.0594C27.5922%2013.2855%2026.3274%2012.0782%2024.8656%2012.0782S22.1391%2013.2937%2022.1391%2015.0594C22.1391%2016.8086%2023.4038%2018.0405%2024.8656%2018.0405S27.5922%2016.8168%2027.5922%2015.0594z%22%20fill%3D%22%23E94235%22/%3E%3Cpath%20d%3D%22M40.5922%2015.0594C40.5922%2017.8927%2038.4159%2019.9786%2035.7387%2019.9786%2033.0696%2019.9786%2030.8851%2017.8927%2030.8851%2015.0594%2030.8851%2012.2096%2033.0614%2010.1401%2035.7387%2010.1401%2038.4159%2010.1401%2040.5922%2012.2096%2040.5922%2015.0594zM38.4734%2015.0594C38.4734%2013.2855%2037.2087%2012.0782%2035.7469%2012.0782%2034.2851%2012.0782%2033.0203%2013.2937%2033.0203%2015.0594%2033.0203%2016.8086%2034.2851%2018.0405%2035.7469%2018.0405%2037.2087%2018.0487%2038.4734%2016.8168%2038.4734%2015.0594z%22%20fill%3D%22%23FABB05%22/%3E%3Cpath%20d%3D%22M51.203%2010.4357v8.8366C51.203%2022.9105%2049.0595%2024.3969%2046.5219%2024.3969%2044.132%2024.3969%2042.7031%2022.7955%2042.161%2021.4897L44.0417%2020.7095C44.3784%2021.5143%2045.1997%2022.4588%2046.5219%2022.4588%2048.1479%2022.4588%2049.1499%2021.4487%2049.1499%2019.568V18.8617H49.0759C48.5914%2019.4612%2047.6552%2019.9786%2046.4808%2019.9786%2044.0171%2019.9786%2041.7668%2017.8352%2041.7668%2015.0758%2041.7668%2012.3%2044.0253%2010.1319%2046.4808%2010.1319%2047.6552%2010.1319%2048.5914%2010.6575%2049.0759%2011.2323H49.1499V10.4357H51.203zM49.2977%2015.084C49.2977%2013.3512%2048.1397%2012.0782%2046.6697%2012.0782%2045.175%2012.0782%2043.9267%2013.3429%2043.9267%2015.084%2043.9267%2016.8004%2045.175%2018.0487%2046.6697%2018.0487%2048.1397%2018.0487%2049.2977%2016.8004%2049.2977%2015.084z%22%20fill%3D%22%234285F4%22/%3E%3Cpath%20d%3D%22M54.9887%205.22083V19.6912H52.8288V5.220829999999999H54.9887z%22%20fill%3D%22%2334A853%22/%3E%3Cpath%20d%3D%22M63.4968%2016.6854L65.1722%2017.8023C64.6301%2018.6072%2063.3244%2019.9869%2061.0659%2019.9869%2058.2655%2019.9869%2056.2534%2017.827%2056.2534%2015.0676%2056.2534%2012.1439%2058.2901%2010.1483%2060.8278%2010.1483%2063.3818%2010.1483%2064.6301%2012.1768%2065.0408%2013.2773L65.2625%2013.8357%2058.6843%2016.5623C59.1853%2017.5478%2059.9737%2018.0569%2061.0741%2018.0569%2062.1746%2018.0569%2062.9384%2017.5067%2063.4968%2016.6854zM58.3312%2014.9115L62.7331%2013.0884C62.4867%2012.4724%2061.764%2012.0454%2060.9017%2012.0454%2059.8012%2012.0454%2058.2737%2013.0145%2058.3312%2014.9115z%22%20fill%3D%22%23E94235%22/%3E%3C/svg%3E"
                    draggable="false"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: 66,
                      height: 26,
                      userSelect: "none",
                      border: 0,
                      padding: 0,
                      margin: 0
                    }}
                  />
                </div>
              </a>
            </div>
          </div>
          <div />
          <div>
            <div
              style={{
                display: "inline-flex",
                position: "absolute",
                right: 0,
                bottom: 0
              }}
            >
              <div className="gmnoprint" style={{ zIndex: 1000001 }}>
                <div
                  draggable="false"
                  className="gm-style-cc"
                  style={{
                    userSelect: "none",
                    position: "relative",
                    height: 14,
                    lineHeight: 14
                  }}
                >
                  <div
                    style={{
                      opacity: "0.7",
                      width: "100%",
                      height: "100%",
                      position: "absolute"
                    }}
                  >
                    <div style={{ width: 1 }} />
                    <div
                      style={{
                        backgroundColor: "rgb(245, 245, 245)",
                        width: "auto",
                        height: "100%",
                        marginLeft: 1
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      paddingRight: 6,
                      paddingLeft: 6,
                      boxSizing: "border-box",
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: 10,
                      color: "rgb(0, 0, 0)",
                      whiteSpace: "nowrap",
                      direction: "ltr",
                      textAlign: "right",
                      verticalAlign: "middle",
                      display: "inline-block"
                    }}
                  >
                    <button
                      draggable="false"
                      aria-label="Keyboard shortcuts"
                      title="Keyboard shortcuts"
                      type="button"
                      style={{
                        background: "none",
                        display: "inline-block",
                        border: 0,
                        margin: 0,
                        padding: 0,
                        textTransform: "none",
                        appearance: "none",
                        position: "relative",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "rgb(0, 0, 0)",
                        fontFamily: "inherit",
                        lineHeight: "inherit"
                      }}
                    >
                      Keyboard shortcuts
                    </button>
                  </div>
                </div>
              </div>
              <div className="gmnoprint" style={{ zIndex: 1000001 }}>
                <div
                  draggable="false"
                  className="gm-style-cc"
                  style={{
                    userSelect: "none",
                    position: "relative",
                    height: 14,
                    lineHeight: 14
                  }}
                >
                  <div
                    style={{
                      opacity: "0.7",
                      width: "100%",
                      height: "100%",
                      position: "absolute"
                    }}
                  >
                    <div style={{ width: 1 }} />
                    <div
                      style={{
                        backgroundColor: "rgb(245, 245, 245)",
                        width: "auto",
                        height: "100%",
                        marginLeft: 1
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      paddingRight: 6,
                      paddingLeft: 6,
                      boxSizing: "border-box",
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: 10,
                      color: "rgb(0, 0, 0)",
                      whiteSpace: "nowrap",
                      direction: "ltr",
                      textAlign: "right",
                      verticalAlign: "middle",
                      display: "inline-block"
                    }}
                  >
                    <button
                      draggable="false"
                      aria-label="Map Data"
                      title="Map Data"
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        margin: 0,
                        padding: 0,
                        textTransform: "none",
                        appearance: "none",
                        position: "relative",
                        cursor: "pointer",
                        userSelect: "none",
                        color: "rgb(0, 0, 0)",
                        fontFamily: "inherit",
                        lineHeight: "inherit",
                        display: "none"
                      }}
                    >
                      Map Data
                    </button>
                    <span style={{}}>Map data ©2023 Google</span>
                  </div>
                </div>
              </div>
              <div className="gmnoscreen">
                <div
                  style={{
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: 11,
                    color: "rgb(0, 0, 0)",
                    direction: "ltr",
                    textAlign: "right",
                    backgroundColor: "rgb(245, 245, 245)"
                  }}
                >
                  Map data ©2023 Google
                </div>
              </div>
              <button
                draggable="false"
                aria-label="Map Scale: 500 m per 66 pixels"
                title="Map Scale: 500 m per 66 pixels"
                type="button"
                className="gm-style-cc"
                aria-describedby="B0342134-8C1F-4EF7-86B3-28DBA88CA278"
                style={{
                  background: "none",
                  display: "none",
                  border: 0,
                  margin: 0,
                  padding: 0,
                  textTransform: "none",
                  appearance: "none",
                  position: "relative",
                  cursor: "pointer",
                  userSelect: "none",
                  height: 14,
                  lineHeight: 14
                }}
              >
                <div
                  style={{
                    opacity: "0.7",
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                  }}
                >
                  <div style={{ width: 1 }} />
                  <div
                    style={{
                      backgroundColor: "rgb(245, 245, 245)",
                      width: "auto",
                      height: "100%",
                      marginLeft: 1
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "relative",
                    paddingRight: 6,
                    paddingLeft: 6,
                    boxSizing: "border-box",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: 10,
                    color: "rgb(0, 0, 0)",
                    whiteSpace: "nowrap",
                    direction: "ltr",
                    textAlign: "right",
                    verticalAlign: "middle",
                    display: "inline-block"
                  }}
                >
                  <span>500 m&nbsp;</span>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      height: 8,
                      bottom: "-1px",
                      width: 70
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 4,
                        position: "absolute",
                        left: 0,
                        top: 0
                      }}
                    />
                    <div
                      style={{
                        width: 4,
                        height: 8,
                        left: 0,
                        top: 0,
                        backgroundColor: "rgb(255, 255, 255)"
                      }}
                    />
                    <div
                      style={{
                        width: 4,
                        height: 8,
                        position: "absolute",
                        backgroundColor: "rgb(255, 255, 255)",
                        right: 0,
                        bottom: 0
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        backgroundColor: "rgb(102, 102, 102)",
                        height: 2,
                        left: 1,
                        bottom: 1,
                        right: 1
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: 2,
                        height: 6,
                        left: 1,
                        top: 1,
                        backgroundColor: "rgb(102, 102, 102)"
                      }}
                    />
                    <div
                      style={{
                        width: 2,
                        height: 6,
                        position: "absolute",
                        backgroundColor: "rgb(102, 102, 102)",
                        bottom: 1,
                        right: 1
                      }}
                    />
                  </div>
                </div>
                <span
                  id="B0342134-8C1F-4EF7-86B3-28DBA88CA278"
                  style={{ display: "none" }}
                >
                  Click to toggle between metric and imperial units
                </span>
              </button>
              <div
                className="gmnoprint gm-style-cc"
                draggable="false"
                style={{
                  zIndex: 1000001,
                  userSelect: "none",
                  position: "relative",
                  height: 14,
                  lineHeight: 14
                }}
              >
                <div
                  style={{
                    opacity: "0.7",
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                  }}
                >
                  <div style={{ width: 1 }} />
                  <div
                    style={{
                      backgroundColor: "rgb(245, 245, 245)",
                      width: "auto",
                      height: "100%",
                      marginLeft: 1
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "relative",
                    paddingRight: 6,
                    paddingLeft: 6,
                    boxSizing: "border-box",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: 10,
                    color: "rgb(0, 0, 0)",
                    whiteSpace: "nowrap",
                    direction: "ltr",
                    textAlign: "right",
                    verticalAlign: "middle",
                    display: "inline-block"
                  }}
                >
                  <a
                    href="https://www.google.com/intl/en_US/help/terms_maps.html"
                    target="_blank"
                    rel="noopener"
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "rgb(0, 0, 0)"
                    }}
                  >
                    Terms
                  </a>
                </div>
              </div>
              <div
                draggable="false"
                className="gm-style-cc"
                style={{
                  userSelect: "none",
                  position: "relative",
                  height: 14,
                  lineHeight: 14
                }}
              >
                <div
                  style={{
                    opacity: "0.7",
                    width: "100%",
                    height: "100%",
                    position: "absolute"
                  }}
                >
                  <div style={{ width: 1 }} />
                  <div
                    style={{
                      backgroundColor: "rgb(245, 245, 245)",
                      width: "auto",
                      height: "100%",
                      marginLeft: 1
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "relative",
                    paddingRight: 6,
                    paddingLeft: 6,
                    boxSizing: "border-box",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: 10,
                    color: "rgb(0, 0, 0)",
                    whiteSpace: "nowrap",
                    direction: "ltr",
                    textAlign: "right",
                    verticalAlign: "middle",
                    display: "inline-block"
                  }}
                >
                  <a
                    target="_blank"
                    rel="noopener"
                    title="Report errors in the road map or imagery to Google"
                    dir="ltr"
                    href="https://www.google.com/maps/@37.3657182,-119.6296779,14z/data=!10m1!1e1!12b1?source=apiv3&rapsrc=apiv3"
                    style={{
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: 10,
                      color: "rgb(0, 0, 0)",
                      textDecoration: "none",
                      position: "relative"
                    }}
                  >
                    Report a map error
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="text-w-3005">
    Experience the enchantment of this California luxury retreat, with
    everything you need for a perfect large-group vacation. This home is set
    on the Yosemite Falls, with panoramic views of the surrounding
    naturescape, including hundreds of feet of riverfront, a private
    waterfall and islet, as well as 5 acres of nature to explore. Enjoy
    top-tier amenities like a private backyard, outdoor dining, barbecue
    grill, fire pit, state-of-the-art workstations and a Tesla. If you
    desire, our Concierge can also arrange for a private chef to come to the
    home.
  </div>
</div>

const travelGuides = <div className="mb-16">
  <div className="mb-6 flex flex-col justify-between md:flex-row md:items-end">
    <div>
      <div className="text-eyebrow-medium text-black/60">Travel guides</div>
      <div className="text-2xl font-bold">
        <span
          data-br=":rc:"
          data-brr={1}
          style={{
            display: "inline-block",
            verticalAlign: "top",
            textDecoration: "inherit",
            textWrap: "balance"
          }}
        >
          Helpful guides and activities to make the best out of your trip.
        </span>
      </div>
    </div>
  </div>
  <div className="group mantine-Carousel-root mantine-7c7vou">
    <div className="mantine-1my8u2w mantine-Carousel-viewport">
      <div
        className="mantine-dvrf6x mantine-Carousel-container"
        style={{ transform: "translate3d(0px, 0px, 0px)" }}
      >
        <div className="mantine-Carousel-slide mantine-o549wk">
          <a
            target="_blank"
            className="group-1 flex h-full cursor-pointer flex-col items-center rounded-lg bg-white/[.12] "
            href="https://www.wander.com/blog/article/top-5-restaurants-near-yosemite-national-park"
          >
            <div className="h-48 w-full overflow-hidden lg:h-52">
              <div className="relative h-full w-full">
                <img
                  src="https://assets.wander.com/314798657280933903/640.webp"
                  className="rounded-t-lg object-cover w-full h-full"
                  alt="Top 5 Restaurants Near Yosemite National Park"
                />
              </div>
            </div>
            <div className="w-full max-w-[360px] flex-1 self-start p-3">
              <h3 className="truncate font-semibold text-black group-1-hover:underline">
                Top 5 Restaurants Near Yosemite National Park
              </h3>
              <div className="mt-1 text-sm font-medium text-w-4004">
                by Codeth Cameron <span className="mx-1">•</span> Jan 27,
                2023
              </div>
            </div>
          </a>
        </div>
        <div className="mantine-Carousel-slide mantine-o549wk">
          <a
            target="_blank"
            className="group-1 flex h-full cursor-pointer flex-col items-center rounded-lg bg-white/[.12] "
            href="https://www.wander.com/blog/article/transportation-guide-wander-yosemite-falls"
          >
            <div className="h-48 w-full overflow-hidden lg:h-52">
              <div className="relative h-full w-full">
                <img
                  src="https://assets.wander.com/314828606394073107/640.webp"
                  className="rounded-t-lg object-cover w-full h-full"
                  alt="Transportation Guide: Wander Yosemite Falls"
                />
              </div>
            </div>
            <div className="w-full max-w-[360px] flex-1 self-start p-3">
              <h3 className="truncate font-semibold text-black group-1-hover:underline">
                Transportation Guide: Wander Yosemite Falls
              </h3>
              <div className="mt-1 text-sm font-medium text-w-4004">
                by Codeth Cameron <span className="mx-1">•</span> Jan 27,
                2023
              </div>
            </div>
          </a>
        </div>
        <div className="mantine-Carousel-slide mantine-o549wk">
          <a
            target="_blank"
            className="group-1 flex h-full cursor-pointer flex-col items-center rounded-lg bg-white/[.12] "
            href="https://www.wander.com/blog/article/6-must-do-activities-in-oakhurst-california"
          >
            <div className="h-48 w-full overflow-hidden lg:h-52">
              <div className="relative h-full w-full">
                <img
                  src="https://assets.wander.com/314828911831678996/fullres.webp"
                  className="rounded-t-lg object-cover w-full h-full"
                  alt="6 Must-do Activities in Oakhurst, California"
                />
              </div>
            </div>
            <div className="w-full max-w-[360px] flex-1 self-start p-3">
              <h3 className="truncate font-semibold text-black group-1-hover:underline">
                6 Must-do Activities in Oakhurst, California
              </h3>
              <div className="mt-1 text-sm font-medium text-w-4004">
                by Codeth Cameron <span className="mx-1">•</span> Jan 27,
                2023
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div className="mantine-19swgkw !-bottom-6 mantine-Carousel-indicators">
      <button
        className="mantine-UnstyledButton-root !w-2 !h-2 !bg-white/40 mantine-Carousel-indicator mantine-1sqy5bm"
        type="button"
        data-active="true"
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        className="mantine-UnstyledButton-root !w-2 !h-2 !bg-white/40 mantine-Carousel-indicator mantine-1sqy5bm"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
      />
      <button
        className="mantine-UnstyledButton-root !w-2 !h-2 !bg-white/40 mantine-Carousel-indicator mantine-1sqy5bm"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
    <div className="mantine-vcl0d1 !opacity-0 group-hover:!opacity-100 transition duration-150 mantine-Carousel-controls">
      <button
        className="mantine-UnstyledButton-root !bg-white/50 !backdrop-blur !text-black !border-none mantine-Carousel-control mantine-tlqh9k"
        type="button"
        tabIndex={0}
      >
        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            transform: "rotate(90deg)"
          }}
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        className="mantine-UnstyledButton-root !bg-white/50 !backdrop-blur !text-black !border-none mantine-Carousel-control mantine-tlqh9k"
        type="button"
        tabIndex={0}
      >
        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            transform: "rotate(-90deg)"
          }}
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
  <div className="mt-11 text-black/50">
    Some details may change as Wander updates our homes and operations.
    Wander Concierge is at your service with any questions.
  </div>
</div>

const videoPresentation = <div className="mb-16 flex flex-col gap-6 md:mb-14">
  <div className="text-2xl font-bold">Small Description</div>
  <div className="relative z-0 h-64 w-full overflow-hidden rounded-lg sm:h-[357px]">
    <div className="absolute inset-y-0 z-20 h-full w-full bg-black/20" />
    <img
      src="https://assets.wander.com/314895638703636482/fullres.webp"
      className="absolute z-10 rounded-lg object-cover w-full h-full"
      alt="Wander Yosemite Fallspicture"
      sizes="100vw"
      style={{ objectFit: "cover" }}
    />
    <div className="relative z-20 h-full w-full">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-:r5:"
        data-state="closed"
        className="hidden h-full w-full items-end md:flex"
      >
        <div className="mb-4 ml-4 flex items-center text-center">
          <div className="mr-5 rounded-full bg-white p-4 text-black hover:bg-gray-200">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 448 512"
              className="relative left-px"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </div>
          <div className="font-semibold text-white">
            Découvrez Prague
          </div>
        </div>
      </button>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-:r8:"
        data-state="closed"
        className="block w-full cursor-pointer md:hidden"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center md:invisible md:hidden">
          <span className="inline-block rounded-full bg-white p-4 text-xl text-black hover:bg-gray-200 lg:p-5 lg:text-2xl">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 448 512"
              className="relative left-px"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </span>
        </div>
      </button>
    </div>
  </div>
</div>



const newArticle = (post, BlockRenderer, CodeRenderer) => {


  return (
    <>
      {headArticle(post)}


      <div className="relative z-40 mx-auto mt-7 flex w-full flex-col justify-between gap-6 rounded-xl px-10 text-black xl:container md:flex-row md:px-0 lg:gap-0">
        <div className="w-full container-md">
          {/*  <div className="flex mb-6">
            <div className="w-full md:w-8/12">
              <div className="text-eyebrow-medium text-black/60">
                Vol
              </div>
              <div className="mb-4 font-headline text-5xl font-bold">
                {post.title}
              </div>
            </div>

            <div className="md:w-4/12">

              <div className="font-headline font-bold">
                {post.smallDescription}
              </div>
              <div className="text-eyebrow-medium text-black/60">
                à partir {post.price}
              </div>
            </div>
          </div> */}

          <div className="text-w-3005 mb-16 leading-6">
            <div>
              <div className="container-md mx-auto px-10">
                <div className="flex mb-10">
                  <img
                    className="h-12 w-12 object-cover rounded-full"
                    src={urlForImage(post.author.image).url()}
                    alt={post.author.name}
                  />

                  <div className="pl-4">
                    <p className="font-medium text-base">
                      <span className="text-gray-900">Publié par {post.author.name}</span>
                    </p>
                    <div className="flex items-center ">
                      <p className="text-gray-600">
                        {new Date(post._createdAt).toDateString()}
                      </p>


                      <GoStar className="text-green-500 ml-2 h-4" />
                    </div>
                    <span className="text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 border border-gray-500">
                      <svg
                        className="w-2.5 h-2.5 mr-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                      </svg>
                      Il y a 3 heures
                    </span>
                  </div>
                </div>
                <BlockContent
                  blocks={post.body}
                  className=""
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                  content={post.body || []}
                  serializers={{
                    types: {
                      block: BlockRenderer,
                      code: CodeRenderer,
                    },
                  }}
                />


                <div className="flex gap-2">

                  <div className="flex-wrap mt-10 w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
                    <p
                      aria-current="true"
                      className="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg  dark:bg-gray-800"
                    >
                      Départ
                    </p>
                    {post.departures.map((departure, i) => {
                      return <p
                        key={i}
                        className="block w-full px-4 py-2 border-b border-gray-200  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                      >
                        {departure.title}
                      </p>
                    })}


                  </div>

                  <div className="flex-wrap mt-10 w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg ">
                    <p
                      aria-current="true"
                      className="block w-full px-4 py-2 text-white bg-blue-700 border-b border-gray-200 rounded-t-lg  dark:bg-gray-800"
                    >
                      Arrivé
                    </p>
                    {post.destination.map((destination, i) => {
                      return <p
                        key={i}
                        className="block w-full px-4 py-2 border-b border-gray-200  hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                      >
                        {destination.title}
                      </p>
                    })}
                  </div>

                </div>

                <a href={`${post.href}`} target="_blank" className="mt-10  inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100">
                  <span className="w-full">Réserver sur Google Flight</span>
                  <svg className="w-4 h-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </a>

              </div>
            </div>
          </div>

          {/* {pointsForts} */}

          {/* {location} */}

          {/* {travelGuides} */}

          {/* {videoPresentation} */}
        </div>

        <div className="relative md:hidden">
          <div
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="mantine-kvr70fbqv-dropdown"
            id="mantine-kvr70fbqv-target"
            className=""
          >
            <div className="hidden md:block">
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="cursor-pointer">
                  <div className="mb-2 text-sm">Check-in</div>
                  <div className="rounded-lg border border-w-6003 p-[10px]">
                    Jan 6, 2024
                  </div>
                </div>
                <div className="cursor-pointer">
                  <div className="mb-2 text-sm">Check-out</div>
                  <div className="rounded-lg border border-w-6003 p-[10px]">
                    Jan 10, 2024
                  </div>
                </div>
              </div>
              <button className="btn w-full">Book</button>
            </div>
          </div>
        </div>




      </div>
    </>
  )
}


const MainArticle = (post, copyCodeToClipboard) => {
  return (<article className="relative z-40 mx-auto mt-7 flex w-full flex-col justify-between gap-6 rounded-xl px-5 text-black xl:container md:flex-row md:px-0 lg:gap-0">
    <div className="w-full md:w-7/12">
      <div className="text-eyebrow-medium text-black/60">
        {'YOUR_DEFAULT_LOCATION'}
      </div>
      <h2 className="mb-4 font-headline text-5xl font-bold">
        {post.title}
      </h2>
      <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-4">
        <img
          className="relative shrink-0 top-0 h-6 w-6 text-4-black"
          src={urlForImage(post.mainImage).url()}
          alt={post.title}
        />
        <div className="flex items-center gap-2 text-sm">
          {post.author.name}
        </div>
      </div>
      {/* ... Other UI components and data ... */}
    </div>
    {/* More sections of the article... */}
    <div className="md:flex space-y-8 md:space-y-0 justify-between items-center space-x-4 py-10 font-extralight text-sm">
      <div className="flex ">
        <img
          className="h-12 w-12 object-cover rounded-full"
          src={urlForImage(post.author.image).url()}
          alt={post.author.name}
        />
        <div className="pl-4">
          <p className="font-medium text-base">
            <span className="text-gray-900">{post.author.name}</span>
          </p>
          <div className="flex items-center ">
            <p className="text-gray-600">
              {new Date(post._createdAt).toDateString()}
            </p>
            <GoStar className="text-gray-500 ml-2 h-4" />
          </div>
        </div>
      </div>
      {/* Social and sharing icons */}
      <div className="flex justify-end items-center space-x-6">
        <div className="border-[0.5px] sm:hidden border-gray-100 w-full"></div>
        <Tooltip title="Share on Twitter" position="top" trigger="mouseenter" arrow={true} delay={300} distance={20}>
          <BsTwitter className="h-[18px] w-[18px] text-gray-500 hover:text-gray-900 duration-300 cursor-pointer" />
        </Tooltip>
        <Tooltip title="Share on Facebook" position="top" trigger="mouseenter" arrow={true} delay={300} distance={20}>
          <GrFacebook className="h-[17px] w-[17px] text-gray-500 hover:text-gray-900 duration-300 cursor-pointer" />
        </Tooltip>
        <Tooltip title="Share on Linkedin" position="top" trigger="mouseenter" arrow={true} delay={300} distance={20}>
          <BsLinkedin className="h-[17px] w-[17px] text-gray-500 hover:text-gray-900 duration-300 cursor-pointer" />
        </Tooltip>
        <Tooltip title="Copy Link" position="top" trigger="mouseenter" arrow={true} delay={300} distance={20}>
          <IoCopy onClick={copyCodeToClipboard} className="h-[17px] w-[17px] text-gray-500 hover:text-gray-900 duration-300 cursor-pointer" />
        </Tooltip>
      </div>
    </div>
  </article>)
}

const CommentSection = (subs, post, submit, emailErr, emaila, InpClicked, setEmailErr) => {
  return (<div className="w-full wrapper p-10 border-t-[4px] border-green-600  bg-gray-100">
    {subs ? (
      <div>
        <h1 className="text-2xl mb-2 capitalize font-bold">
          thank you for your subscription
        </h1>
        <h2>
          You will be getting daily news about {post.author.name} posts
        </h2>
      </div>
    ) : (
      <div className="z-0">
        <h1 className="text-2xl font-bold">
          Get an email whenever {post.author.name} publishes.
        </h1>
        <form
          onSubmit={submit}
          className="pt-6 space-y-4 w-full   sm:space-x-4  justify-between flex flex-col sm:flex-row items-center"
        >
          <div
            className={`${emailErr
              ? " w-[100%]  sm:w-[67%]  animate-[wave_0.8s_ease-in-out_1]"
              : " w-[100%]   sm:w-[67%]"
              }`}
          >
            <input
              value={emaila.email}
              onChange={InpClicked}
              name="email"
              id="emailinp"
              type="text"
              className={`${emailErr
                ? "block z-0   w-full py-2.5 px-0 text-sm text-gray-600 bg-transparent border-0 border-b-[1px]  appearance-none  dark:border-red-600 dark:focus:border-primary-100 focus:outline-none focus:ring-0 focus:border-red-600  peer"
                : "block z-0 w-full py-2.5 px-0 text-sm text-gray-600 bg-transparent border-0 border-b-[1px]  appearance-none  dark:border-gray-400 dark:focus:border-primary-100 focus:outline-none focus:ring-0 focus:border-green-600  peer"
                }`}
              placeholder="Your Email"
              required
            />{" "}
            {emailErr && (
              <BiErrorAlt className="text-red-500 absolute right-0 top-4" />
            )}
          </div>

          <button
            className="w-full sm:w-auto"
            onClick={() => setEmailErr(false)}
          >
            <div className="flex  justify-center items-center space-x-2 bg-green-600 hover:bg-green-700  duration-500 text-black py-[11px] px-0 sm:px-8 rounded-full">
              <RiMailSendLine className="h-[23px] w-[23px]" />
              <span>Subscribe</span>
            </div>
          </button>
        </form>
        {emailErr && (
          <h2 className="text-red-500 pb-4 pt-4 sm:pt-0 text-sm">
            Enter a valid email address.
          </h2>
        )}
        <h2 className="pr-4 text-xs  pt-6">
          By signing up, you will create a Medium account if you don’t
          already have one. Review our{" "}
          <span className="cursor-pointer underline">
            Privacy Policy
          </span>{" "}
          for more information about our privacy practices.
        </h2>
      </div>
    )}
  </div>)
}

const signFunction = (sign, setsignup, setsign, signup, signUpWithGoogle, setloginpassword, loginemail, loginpassword, messageerr, messageerr1, messageerr2, setloginemail, signInWithGoogle, registeremail, registerpassword, setregisterpassword, login, successlogin, setregisteremail, handlesubmit) => {
  {
    (() => {
      if (sign === 0) {
        return (
          <div className="text-center">
            <div
              onClick={() => {
                setsignup(false);
                setsign(0);
              }}
              className={`${signup
                ? "fixed inset-0 bg-gray-100   backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                }`}
            />
            <div
              className={`${signup
                ? "scale-100  z-[100] md:z-10 ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto  rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                }`}
            >
              {signup && (
                <div className="w-full  md:mx-[20rem] my-[10rem]">
                  <div
                    className="p-4  cursor-pointer  z-50  absolute top-0 pt-10 pr-10 right-0"
                    onClick={() => setsignup(false)}
                  >
                    <VscClose className="h-8 w-8  text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                  </div>
                  <div className="px-10  md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="">
                      <div className="flex-col font-poppins text-2xl  flex justify-center my-10">
                        <h1 className="py-10">Join Medium.</h1>
                        <h2 className="text-sm max-w-[24rem] m-auto">
                          Create an account to receive great stories in your
                          inbox, personalize your homepage, and follow authors
                          and topics that you love.
                        </h2>
                      </div>
                      <div>
                        <div
                          onClick={signUpWithGoogle}
                          className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-[13px] px-4 py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                        >
                          <FcGoogle className="h-[19px] w-[19px]" />
                          <h2>Sign up with Google</h2>
                        </div>
                        <div
                          onClick={() => {
                            setsign(2);
                          }}
                          className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-10 px-[21px] py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                        >
                          <IoMailOutline className="h-[19px] w-[19px] text-black" />
                          <h2>Sign up with Email </h2>
                        </div>
                      </div>
                      <div className="font-poppins mb-16 text-sm flex justify-center">
                        Already have an account? {"  "}
                        <span
                          onClick={() => setsign(1)}
                          className="text-green-600 cursor-pointer font-bold ml-2"
                        >
                          {" "}
                          Sign in
                        </span>
                      </div>
                      <div className="font-poppins  mb-20   text-center text-gray-600 text-xs flex justify-center items-center">
                        <h2>
                          Click “Sign Up” to agree to Medium’s Terms of
                          Service and acknowledge that Medium’s Privacy Policy
                          applies to you.
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      } else if (sign === 1) {
        return (
          <div className="text-center ">
            <div
              onClick={() => {
                setsignup(false);
                setsign(0);
              }}
              className={`${signup
                ? "fixed inset-0 bg-gray-100  backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                }`}
            />
            <div
              className={`${signup
                ? "scale-100 z-[100] md:z-10  ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                }`}
            >
              {signup && (
                <div className="w-full md:px-[20rem] py-[10rem]">
                  <div
                    className="p-4 z-50 cursor-pointer absolute top-0 pt-10 pr-10 right-0"
                    onClick={() => setsignup(false)}
                  >
                    <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                  </div>
                  <div className="px-10  md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="">
                      <div className="capitalize  font-poppins text-2xl  flex justify-center py-10">
                        <h1>Welcome back.</h1>
                      </div>
                      <div>
                        <div
                          onClick={signInWithGoogle}
                          className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-[13px] px-4 py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                        >
                          <FcGoogle />
                          <h2>Sign in with Google</h2>
                        </div>
                        <div
                          onClick={() => {
                            setsign(3);
                          }}
                          className="flex w-fit m-auto  items-center justify-center space-x-4 border-[1px] mb-10 px-[21px] py-2 cursor-pointer  border-gray-600 hover:border-gray-900 rounded-full font-poppins text-sm text-gray-800"
                        >
                          <IoMailOutline className="h-[19px] w-[19px] text-black" />
                          <h2>Sign in with Email </h2>
                        </div>
                      </div>
                      <div className="font-poppins mb-16 text-sm flex justify-center">
                        No account?
                        <span
                          onClick={() => setsign(0)}
                          className="text-green-600 cursor-pointer font-bold ml-2"
                        >
                          {" "}
                          Create one
                        </span>
                      </div>
                      <div className="font-poppins  mb-20   text-center text-gray-600 text-xs flex justify-center items-center">
                        <h2>
                          Click “Sign In” to agree to Medium’s Terms of
                          Service and acknowledge that Medium’s Privacy Policy
                          applies to you.
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      } else if (sign === 2) {
        return (
          <div className="text-center ">
            <div
              onClick={() => {
                setsignup(false);
                setsign(0);
              }}
              className={`${signup
                ? "fixed inset-0 bg-gray-100  backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                }`}
            />
            <div
              className={`${signup
                ? "scale-100 z-[100] md:z-10  ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                }`}
            >
              {signup && (
                <div className="w-full md:px-[20rem] py-[10rem]">
                  <div
                    className="p-4 cursor-pointer absolute top-0 pt-10 pr-10 right-0"
                    onClick={() => setsignup(false)}
                  >
                    <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                  </div>
                  <div className="px-10  md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="">
                      <div className="capitalize flex flex-col  font-poppins text-2xl  space-y-2 justify-center py-10">
                        <h1>Sign up with email</h1>
                        <h2 className="capitalize  font-poppins text-sm  ">
                          Enter your email address to create an account.
                        </h2>
                      </div>
                      <form
                        onSubmit={handlesubmit}
                        className="flex flex-col w-[90%] sm:w-[60%]  mb-10 mt-6 m-auto "
                      >
                        <label
                          className="text-gray-900 text-sm"
                          htmlFor="email"
                        >
                          Your Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          onChange={(e) => {
                            setregisteremail(e.target.value);
                          }}
                          className="w-full md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                          type="text"
                          required
                          max={20}
                        />
                        <label
                          className="text-gray-900 text-sm mt-4"
                          htmlFor="password"
                        >
                          Your password
                        </label>
                        <input
                          onChange={(e) => {
                            setregisterpassword(e.target.value);
                          }}
                          name="password"
                          id="password"
                          type="password"
                          className="w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                          required
                          max={20}
                        />
                        <input
                          className="px-8 mt-4 w-[70%] m-auto py-2 bg-gray-900 cursor-pointer hover:bg-white duration-100 rounded-full text-black"
                          type="submit"
                          value={successlogin ? "Successed" : "Continue"}
                        />
                        {messageerr && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">
                              Invalid mail or password
                            </h2>
                          </div>
                        )}
                        {messageerr1 && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">
                              Email already in use
                            </h2>
                          </div>
                        )}
                        {messageerr2 && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">Weak Password</h2>
                          </div>
                        )}
                      </form>

                      <div
                        onClick={() => setsign(0)}
                        className="font-poppins items-center  mb-16 text-sm flex justify-center"
                      >
                        <BsChevronLeft className="text-green-600 h-4 w-4" />
                        <span className="text-green-600 cursor-pointer  ml-2">
                          {" "}
                          All sign up options
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      } else if (sign === 3) {
        return (
          <div className="text-center ">
            <div
              onClick={() => {
                setsignup(false);
                setsign(0);
              }}
              className={`${signup
                ? "fixed inset-0 bg-gray-100  backdrop-blur-md duration-500  bg-opacity-60 ease-in-out transition-all  overflow-y-hidden flex justify-center items-center "
                : "fixed inset-0 backdrop-blur-0 pointer-events-none duration-500  bg-opacity-0  ease-in-out transition-all overflow-y-hidden   "
                }`}
            />
            <div
              className={`${signup
                ? "scale-100 z-[100] md:z-10  ease-in-out duration-500 min-h-full md:min-h-[600px] w-full md:w-auto md:h-auto md:m-auto   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                : "scale-0  ease-in-out duration-500 h-[600px] w-[500px]   rounded-lg fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-xl"
                }`}
            >
              {signup && (
                <div className="w-full md:px-[20rem] py-[10rem]">
                  <div
                    className="p-4 cursor-pointer absolute z-50 top-0 pt-10 pr-10 right-0"
                    onClick={() => setsignup(false)}
                  >
                    <VscClose className="h-8 w-8 text-gray-400 hover:text-gray-700 duration-100 text-2xl cursor-pointer" />
                  </div>
                  <div className="px-10 mt-6   md:-translate-0 absolute w-full m-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="">
                      <div className="capitalize flex flex-col  font-poppins text-2xl  space-y-2 justify-center py-10">
                        <h1>Sign in with email</h1>
                        <h2 className="capitalize px-12 font-poppins text-sm  ">
                          Enter the email address & password associated with
                          your account, and we’ll send you right to home page.
                        </h2>
                      </div>
                      <form
                        onSubmit={login}
                        className="flex flex-col w-[90%] sm:w-[60%]  mb-10 mt-2 m-auto "
                      >
                        <label
                          className="text-gray-900 text-sm"
                          htmlFor="email"
                        >
                          Your Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          onChange={(e) => {
                            setloginemail(e.target.value);
                          }}
                          className="w-full md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                          type="text"
                          required
                          max={20}
                        />
                        <label
                          className="text-gray-900 text-sm mt-4"
                          htmlFor="password"
                        >
                          Your password
                        </label>
                        <input
                          onChange={(e) => {
                            setloginpassword(e.target.value);
                          }}
                          name="password"
                          id="password"
                          type="password"
                          className="w-full my-2 md:w-[80%] m-auto text-center focus:none outline-none border-b-[0.2px] py-[4px] border-gray-900/50 hover:border-gray-700 duration-100 focus:border-black"
                          required
                          max={20}
                        />
                        <input
                          className="px-8 mt-8 w-[70%] m-auto py-2 bg-gray-900 cursor-pointer hover:bg-white duration-100 rounded-full text-black"
                          type="submit"
                          value="Continue"
                        />
                        {messageerr && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">
                              Invalid mail or password
                            </h2>
                          </div>
                        )}
                        {messageerr1 && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">
                              Email already in use
                            </h2>
                          </div>
                        )}
                        {messageerr2 && (
                          <div className="mt-4 flex justify-start space-x-[8px] items-center">
                            <BiErrorAlt className="text-red-500 h-6" />
                            <h2 className="text-red-500">Weak Password</h2>
                          </div>
                        )}
                      </form>

                      <div
                        onClick={() => setsign(0)}
                        className="font-poppins items-center  mb-16 text-sm flex justify-center"
                      >
                        <BsChevronLeft className="text-green-600 h-4 w-4" />
                        <span className="text-green-600 cursor-pointer  ml-2">
                          {" "}
                          All sign up options
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }
    })()
  }
}

{/* posts on map */ }

{/* third section */ }
{/*  <div className="h-[110vh]   hidescrollbar relative hidden xl:flex">
        <div
          className={`${
            user
              ? "fixed     bottom-0 top-0 overflow-y-scroll  w-[380px] col-span-2 px-8 py-0"
              : "fixed    bottom-0 top-0 overflow-y-scroll  w-[380px] col-span-2 px-8 py-16"
          }`}
        >
          {!user && (
            <div className="space-x-8">
              <button
                onClick={() => setsignup(true)}
                className="bg-gray-800 hover:bg-gray-900 duration-500 px-16 py-2 rounded-full text-black"
              >
                Get started
              </button>
              <button
                onClick={() => {
                  setsignup(true);
                  setsign(1);
                }}
                className="text-black hover:text-green-600"
              >
                Sign in
              </button>
            </div>
          )}
          <div className="w-full py-10 relative">
            <input
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="px-12 w-[100%] py-2 rounded-full border-gray-200 border-[1px] outline-none text-sm"
              type="text"
              placeholder="Search.."
              name=""
              id=""
            />
            <FiSearch className="absolute -translate-y-1/2 top-1/2  -translate-x-1/2 left-8 h-4" />
          </div>
          <div>
            {searchTerm !== "" && (
              <div
                className={`${
                  user
                    ? "bg-gray-100 w-[330px] top-[95px]  absolute p-4 space-y-2 rounded-md shadow-lg backdrop-blur-xl"
                    : "bg-gray-100 w-[330px]  top-[200px]  absolute p-4 space-y-2 rounded-md shadow-lg backdrop-blur-xl"
                }`}
              >
                <h2 className="mt-4">From Medium</h2>
                <hr />
                {posts
                  .filter((val) => {
                    if (
                      val.title.toLowerCase().includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    } else if (searchTerm == "") {
                      return val;
                    }
                  })
                  .map((post) => {
                    return (
                      <>
                        <div>
                          <Link
                            passHref
                            key={post._id}
                            href={`/post/${post.slug.current}`}
                          >
                            <div key={post._id}>
                              <div className="my-8 cursor-pointer ">
                                <h2 className="text-sm word-breaks text-gray-900 hover:text-black duration-100">
                                  {post.title}
                                </h2>

                                <h2 className="text-xs text-gray-500">
                                  {" "}
                                  {new Date(
                                    post._createdAt
                                  ).toDateString()}{" "}
                                </h2>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </>
                    );
                  })}
              </div>
            )}
          </div>
          <div>
            <div>
              <img
                className="h-24 w-24 object-cover rounded-full"
                src={urlForImage(post.author.image).url()!}
                alt=""
              />
              <h1 className="font-bold py-4 text-gray-900">
                {post.author.name}
              </h1>
              <h2 className="text-gray-500 text-sm">
                <BlockContent
                  className=""
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                  projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                  blocks={post.author.bio}
                />
              </h2>
              <div className="py-4 flex items-center space-x-4">
                <button
                  value={followed ? "Followed" : "Follow"}
                  onClick={Clickedfollow}
                  className={`${
                    followed
                      ? "border-[1px] rounded-full border-green-600 hover:border-green-800 duration-500  px-6 py-2 text-gray-900"
                      : "bg-green-600 rounded-full hover:bg-green-700 duration-500  px-4 py-2 text-black"
                  }`}
                >
                  {followed ? "Following" : "Follow"}
                </button>
                <div
                  onClick={ClickedMail}
                  className="h-[37px] w-[37px] cursor-pointer flex justify-center items-center  rounded-full bg-green-600 hover:bg-green-700 duration-500"
                >
                  <RiMailAddLine className="text-black text-xl" />{" "}
                </div>
              </div>
              <div className="py-4">
                <h2 className="text-gray-900 text-md font-semibold capitalize">
                  more from medium
                </h2>
                <div className="py-6">
                  {posts.slice(0, 5)?.map((post) => (
                    <Link
                      passHref
                      key={post._id}
                      href={`/post/${post.slug.current}`}
                    >
                      <div className="flex items-start justify-between py-4">
                        <div className="space-y-2 flex flex-col jusify-center cursor-pointer">
                          <div className="flex items-center space-x-2">
                            {" "}
                            <img
                              alt="r"
                              className="h-6 rounded-full"
                              src={urlForImage(post.author.image).url()!}
                            />
                            <span className="text-sm font-normal capitalize">
                              {post.author.name}
                            </span>
                          </div>
                          <div>
                            <p className="text-[16px] text-md font-semibold w-[225px]">
                              {post.title}
                            </p>
                          </div>
                        </div>
                        <div className="h-16 w-16 flex justify-start">
                          <img
                            className="h-full w-full rounded-md cursor-pointer  object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                            src={urlForImage(post.mainImage).url()!}
                            alt="image"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-xs mt-10">
                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Help
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Status
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Writers
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Blog
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Careers
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Privacy
                  </span>
                  <br />
                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Terms
                  </span>

                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    About
                  </span>
                  <span className="cursor-pointer text-gray-500 hover:text-gray-900 duration-100 pr-4">
                    Knowable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
{/* SIGN UP */ }

export default Post;

//  if you want to use ssg (bellow)

// export const getStaticPaths: GetStaticPaths = async () => {
//   const query = `*[_type=="post"]{
//         _id,
//        slug{
//         current
//       }
//       }`;
//   const posts = await client.fetch(query);
//   const paths = posts.map((post: Post) => ({
//     params: {
//       slug: post.slug.current,
//     },
//   }));
//   return {
//     paths,
//     fallback: "blocking",
//   };
// };
// let subscription = undefined;

// export const getStaticProps: GetStaticProps = async ({ params }) => { this is for ssg
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
    *[_type=="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        price,
        href,
        smallDescription,
        departures[]-> {
          title,
          description
        },
        pointsForts[],
        destination[]-> {
          title,
          description
        },
        priceRange{
          low,
          high
        },
        author-> {
        name,
        bio,
        last,
        image,
        "imageUrl": image.asset->url
      },
      "comments": *[
          _type == "comment" && 
          post._ref == ^._id  && approved==true
       ]{name,last,comment,_createdAt, userImage},

      description,
      mainImage,
      title,
       slug,
       body
      }`;

  const query1 = `
      *[_type=="post"]{
        _id,
        title,
        _createdAt,
        author -> {
        name,
        image
      },
      description,
      mainImage,
      body,
      slug,
      price
      }`;
  const posts = await client.fetch(query1);

  const post = await client.fetch(query, {
    slug: params?.slug,
    next: {
      revalidate: 36000 // look for updates to revalidate cache every hour
    }
  }
  );

  if (!post) {
    return {
      notFound: true,
    };
  }

  console.log('post', post)

  return {
    props: {
      post,
      posts,
    },

    // revalidate: 60, this is for ssg
  };
};

function CommentSent() {
  return (
    <svg
      className="max-h-[100px] my-6"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      data-name="Layer 1"
      width="924"
      height="458.12749"
      viewBox="0 0 924 458.12749"
    >
      <ellipse
        cx="448.17846"
        cy="584.7146"
        rx="21.53369"
        ry="6.76007"
        transform="translate(-396.01217 573.65899) rotate(-69.08217)"
        fill="#2f2e41"
      />
      <circle
        cx="408.37125"
        cy="617.2367"
        r="43.06735"
        transform="translate(-404.30923 700.52813) rotate(-80.78252)"
        fill="#2f2e41"
      />
      <rect
        x="250.74566"
        y="430.10005"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="276.91314"
        y="430.10005"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="261.6488"
        cy="453.81434"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="287.81628"
        cy="453.26918"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <circle
        cx="409.4616"
        cy="606.33348"
        r="14.71922"
        transform="translate(-155.63358 -208.64722) rotate(-1.68323)"
        fill="#fff"
      />
      <circle cx="271.4616" cy="385.39723" r="4.90643" fill="#3f3d56" />
      <path
        d="M366.59454,577.1852c-3.47748-15.57379,7.63867-31.31043,24.82861-35.1488s33.94423,5.67511,37.42171,21.24884-7.91492,21.31762-25.10486,25.156S370.072,592.75905,366.59454,577.1852Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <ellipse
        cx="359.86311"
        cy="597.25319"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-471.98369 445.52283) rotate(-64.62574)"
        fill="#2f2e41"
      />
      <path
        d="M387.21673,632.77358c0,4.21515,10.85327,12.53857,22.89656,12.53857s23.33515-11.867,23.33515-16.08209-11.29193.81775-23.33515.81775S387.21673,628.55843,387.21673,632.77358Z"
        transform="translate(-138 -220.93625)"
        fill="#fff"
      />
      <path
        d="M711.25977,500.2,664.48,546.37,558.75977,650.69l-2.13965,2.11L544.7002,664.56,519.71,639.87l-2.20019-2.17-45.69-45.13h-.00976L457.16992,578.1l-8.6499-8.55-25.76025-25.44-3.4795-3.44-41.06006-40.56a117.65792,117.65792,0,0,1-20.52-27.63c-.5-.91-.97022-1.83-1.43018-2.75A117.50682,117.50682,0,0,1,480.98,301.2h.01025c.37989.06.75.12,1.12989.2a113.60526,113.60526,0,0,1,11.91015,2.77A117.09292,117.09292,0,0,1,523.1499,317.1q1.4253.885,2.82031,1.8a118.17183,118.17183,0,0,1,18.46973,15.09l.3501-.35.3501.35a118.54248,118.54248,0,0,1,10.83007-9.58c.82959-.65,1.66993-1.29,2.50977-1.91a117.44922,117.44922,0,0,1,90.51025-21.06,111.92113,111.92113,0,0,1,11.91993,2.78q1.96507.55509,3.8999,1.2c1.04.34,2.08008.69,3.10986,1.07a116.42525,116.42525,0,0,1,24.39014,12.1q2.50488,1.63494,4.93994,3.42A117.54672,117.54672,0,0,1,711.25977,500.2Z"
        transform="translate(-138 -220.93625)"
        fill="#37a34a"
      />
      <path
        d="M664.48,546.37,558.75977,650.69l-2.13965,2.11L544.7002,664.56,519.71,639.87l-2.20019-2.17-45.69-45.13c7.34034-1.71,18.62012.64,22.75,2.68,9.79,4.83,17.84034,12.76,27.78028,17.28A46.138,46.138,0,0,0,550.68018,615.66c17.81982-3.74,31.60986-17.52,43.77-31.08,12.15966-13.57,24.58984-28.13,41.67968-34.42C645.14014,546.84,654.81982,546.09,664.48,546.37Z"
        transform="translate(-138 -220.93625)"
        opacity="0.15"
      />
      <path
        d="M741.33984,335.92a118.15747,118.15747,0,0,0-52.52978-30.55c-1.31983-.37-2.62988-.7-3.96-1.01A116.83094,116.83094,0,0,0,667.46,301.57c-1.02-.1-2.04-.17-3.06982-.22a115.15486,115.15486,0,0,0-15.43018.06,118.39675,118.39675,0,0,0-74.83984,33.45l-.36035-.36-.35987.36a118.61442,118.61442,0,0,0-46.6997-28.08c-.99024-.32-1.99024-.63-2.99024-.92a119.67335,119.67335,0,0,0-41.62012-4.45c-.38964.02-.77978.05-1.15966.09a118.30611,118.30611,0,0,0-69.39991,29.4c-1.82031,1.6-3.61035,3.28-5.35009,5.02A119.14261,119.14261,0,0,0,379.54,463.47c.3501.94.73,1.87006,1.12988,2.8a118.153,118.153,0,0,0,25.51026,37.95l38.91992,38.42,3.06006,3.03,84.21972,83.13,2.16992,2.15,22.12012,21.84,17.08985,16.87L741.33984,504.21A119.129,119.129,0,0,0,741.33984,335.92ZM739.23,502.08,573.75977,665.44l-14.94971-14.76-21.6499-21.37-2.16993-2.14-82.58007-81.53-3.01026-2.97L408.2998,502.09A115.19343,115.19343,0,0,1,383.54,465.37c-.3999-.93-.78027-1.86-1.12988-2.79A116.13377,116.13377,0,0,1,408.2998,338.04q2.79054-2.79,5.71-5.34H414.02a115.38082,115.38082,0,0,1,66.48-28.16q4.905-.42,9.81982-.42c1.23,0,2.4502.02,3.68018.06a116.0993,116.0993,0,0,1,29.6499,4.8c.99024.29,1.98.6,2.96.93a114.15644,114.15644,0,0,1,29.33008,14.49,115.61419,115.61419,0,0,1,16.41016,13.64l1.06006,1.06.34961-.35.35009.35,1.06006-1.06a115.674,115.674,0,0,1,85.71-33.86c1.27.04,2.54.1,3.81006.19,1.02.06,2.04.13,3.05029.23a115.12349,115.12349,0,0,1,19.08985,3.35c1.33984.34,2.66992.71,3.98974,1.12A115.9591,115.9591,0,0,1,739.23,502.08Z"
        transform="translate(-138 -220.93625)"
        fill="#3f3d56"
      />
      <path
        d="M506.87988,308.71c-6.41992,5.07-13.31006,9.75-17.48,16.68-3.06982,5.12-4.3999,11.07-5.39013,16.95-1.91993,11.44-2.73975,23.16-6.5,34.12994-3.75,10.97-11.06983,21.45-21.91993,25.54-6.73,2.53-14.1499,2.39-21.31982,1.9-17.68994-1.2-35.5-4.37-51.41992-12.16-8.8999-4.36-17.53028-10.24-27.41992-10.89a25.39538,25.39538,0,0,0-6.02.33A117.494,117.494,0,0,1,480.98,301.2h.01025c.37989.06.75.12,1.12989.2a113.60526,113.60526,0,0,1,11.91015,2.77A117.48205,117.48205,0,0,1,506.87988,308.71Z"
        transform="translate(-138 -220.93625)"
        opacity="0.15"
      />
      <path
        d="M224.76412,625.76982a28.74835,28.74835,0,0,0,27.7608-4.89018c9.72337-8.16107,12.77191-21.60637,15.25242-34.056L275.11419,550l-15.36046,10.57663c-11.04633,7.60609-22.34151,15.45585-29.99,26.47289s-10.987,26.0563-4.8417,37.97726Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <path
        d="M226.07713,670.35248c-1.55468-11.32437-3.15331-22.7942-2.06278-34.24.96851-10.16505,4.06971-20.09347,10.38337-28.23408a46.968,46.968,0,0,1,12.0503-10.9196c1.205-.76061,2.31413,1.14911,1.11434,1.90641a44.6513,44.6513,0,0,0-17.66194,21.31042c-3.84525,9.78036-4.46274,20.44179-3.80011,30.83136.40072,6.283,1.25,12.52474,2.1058,18.75851a1.14389,1.14389,0,0,1-.771,1.358,1.11066,1.11066,0,0,1-1.358-.771Z"
        transform="translate(-138 -220.93625)"
        fill="#f2f2f2"
      />
      <path
        d="M241.05156,650.3137a21.16242,21.16242,0,0,0,18.439,9.51679c9.33414-.4431,17.11583-6.95774,24.12082-13.14262l20.71936-18.29363L290.618,627.738c-9.86142-.47193-19.97725-.91214-29.36992,2.12894s-18.05507,10.35987-19.77258,20.082Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <path
        d="M221.68349,676.86232c7.48292-13.24055,16.16246-27.95592,31.67134-32.65919a35.34188,35.34188,0,0,1,13.32146-1.37546c1.41435.12195,1.06117,2.30212-.3506,2.18039a32.83346,32.83346,0,0,0-21.259,5.62435c-5.99423,4.0801-10.66138,9.75253-14.61162,15.76788-2.41964,3.68458-4.587,7.52548-6.75478,11.36122-.69277,1.22582-2.7177.341-2.01683-.89919Z"
        transform="translate(-138 -220.93625)"
        fill="#f2f2f2"
      />
      <circle cx="300.09051" cy="76.05079" r="43.06733" fill="#2f2e41" />
      <rect
        x="280.4649"
        y="109.85048"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="306.63238"
        y="109.85048"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="291.36798"
        cy="133.56477"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="317.53552"
        cy="133.0196"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <circle cx="301.18084" cy="65.14766" r="14.71923" fill="#fff" />
      <ellipse
        cx="444.18084"
        cy="289.08391"
        rx="4.88594"
        ry="4.92055"
        transform="translate(-212.34041 177.70056) rotate(-44.98705)"
        fill="#3f3d56"
      />
      <path
        d="M396.31372,256.93569c-3.47748-15.57379,7.63865-31.31043,24.82866-35.14881s33.94421,5.67511,37.42169,21.24891-7.91492,21.31768-25.10486,25.156S399.79126,272.50954,396.31372,256.93569Z"
        transform="translate(-138 -220.93625)"
        fill="#e6e6e6"
      />
      <ellipse
        cx="770.70947"
        cy="573.81404"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-326.96946 400.5432) rotate(-39.51212)"
        fill="#2f2e41"
      />
      <circle
        cx="808.20127"
        cy="616.79758"
        r="43.06735"
        transform="translate(-226.36415 -83.51221) rotate(-9.21748)"
        fill="#2f2e41"
      />
      <rect
        x="676.74319"
        y="429.66089"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <rect
        x="650.5757"
        y="429.66089"
        width="13.08374"
        height="23.44171"
        fill="#2f2e41"
      />
      <ellipse
        cx="678.92379"
        cy="453.37519"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <ellipse
        cx="652.75631"
        cy="452.83005"
        rx="10.90314"
        ry="4.08868"
        fill="#2f2e41"
      />
      <path
        d="M823.27982,593.8192c-13.57764-11.21939-21.12423-21.50665-10.95965-33.80776s29.41145-13.178,42.98908-1.9586,16.34444,30.28655,6.17986,42.58766S836.85746,605.03859,823.27982,593.8192Z"
        transform="translate(-138 -220.93625)"
        fill="#37a34a"
      />
      <circle
        cx="793.31102"
        cy="594.44957"
        r="14.71922"
        transform="translate(-155.11887 -197.37727) rotate(-1.68323)"
        fill="#fff"
      />
      <circle cx="650.1378" cy="369.86765" r="4.90643" fill="#3f3d56" />
      <path
        d="M771.06281,606.5725c-2.98056,2.98056-5.08788,12.64434-.89538,16.83684s16.51464-.26783,19.49516-3.24834-4.50917-3.35271-8.70164-7.54518S774.04337,603.59194,771.06281,606.5725Z"
        transform="translate(-138 -220.93625)"
        fill="#fff"
      />
      <ellipse
        cx="841.39416"
        cy="654.27547"
        rx="6.76007"
        ry="21.53369"
        transform="translate(-316.14156 122.58618) rotate(-20.9178)"
        fill="#2f2e41"
      />
      <path
        d="M1061,679.06375H139a1,1,0,0,1,0-2h922a1,1,0,0,1,0,2Z"
        transform="translate(-138 -220.93625)"
        fill="#ccc"
      />
    </svg>
  );
}
function Comment() {
  return (
    <svg
      className=""
      width="24"
      fill="gray"
      height="24"
      viewBox="0 0 24 24"
      aria-label="responses"
    >
      <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
    </svg>
  );
}
function Like() {
  return (
    <svg
      fill="gray"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="clap"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
      ></path>
    </svg>
  );
}
function HomeUnclicked() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Home"
    >
      <path
        d="M4.5 10.75v10.5c0 .14.11.25.25.25h5c.14 0 .25-.11.25-.25v-5.5c0-.14.11-.25.25-.25h3.5c.14 0 .25.11.25.25v5.5c0 .14.11.25.25.25h5c.14 0 .25-.11.25-.25v-10.5M22 9l-9.1-6.83a1.5 1.5 0 0 0-1.8 0L2 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
function Save() {
  return (
    <svg
      className="cursor-not-allowed text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M17.5 1.25a.5.5 0 0 1 1 0v2.5H21a.5.5 0 0 1 0 1h-2.5v2.5a.5.5 0 0 1-1 0v-2.5H15a.5.5 0 0 1 0-1h2.5v-2.5zm-11 4.5a1 1 0 0 1 1-1H11a.5.5 0 0 0 0-1H7.5a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4v-8.5a.5.5 0 0 0-1 0v7.48l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V5.75z"
        fill="#000"
      ></path>
    </svg>
  );
}
function HomePhone() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      fill="none"
      aria-label="home"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.72 2.93a.45.45 0 0 1 .56 0l.34-.43-.34.43 9.37 7.5a.56.56 0 1 0 .7-.86l-9.38-7.5a1.55 1.55 0 0 0-1.94 0l-9.38 7.5a.56.56 0 0 0 .7.86l9.37-7.5zm7.17 9.13v-1.4l.91.69a.5.5 0 0 1 .2.4V20a2 2 0 0 1-2 2h-4a.5.5 0 0 1-.5-.5V17a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v4.5a.5.5 0 0 1-.5.5H6a2 2 0 0 1-2-2v-8.25a.5.5 0 0 1 .2-.4l.91-.68V20c0 .5.4.89.89.89h3.39V17a2.11 2.11 0 0 1 2.11-2.11h1A2.11 2.11 0 0 1 14.61 17v3.89H18a.89.89 0 0 0 .89-.89v-7.95z"
        fill="#A8A8A8"
      ></path>
    </svg>
  );
}

function Notif() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Notifications"
    >
      <path
        d="M15 18.5a3 3 0 1 1-6 0"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
      <path
        d="M5.5 10.53V9a6.5 6.5 0 0 1 13 0v1.53c0 1.42.56 2.78 1.57 3.79l.03.03c.26.26.4.6.4.97v2.93c0 .14-.11.25-.25.25H3.75a.25.25 0 0 1-.25-.25v-2.93c0-.37.14-.71.4-.97l.03-.03c1-1 1.57-2.37 1.57-3.79z"
        stroke="currentColor"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
function Stories() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Stories"
    >
      <path
        d="M4.75 21.5h14.5c.14 0 .25-.11.25-.25V2.75a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25v18.5c0 .14.11.25.25.25z"
        stroke="currentColor"
      ></path>
      <path
        d="M8 8.5h8M8 15.5h5M8 12h8"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}
function Search() {
  return (
    <svg
      className="cursor-pointer text-gray-800 hover:text-black duration-100"
      width="25"
      height="24"
      fill="none"
      aria-label="search"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.8 10.69a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73a8.05 8.05 0 0 0-5.94-13.5z"
        fill="#A8A8A8"
      ></path>
    </svg>
  );
}
function ReadingList() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-label="Reading list"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3a2 2 0 0 0-2 2v1H6a2 2 0 0 0-2 2v14a.5.5 0 0 0 .8.4l5.7-4.4 5.7 4.4a.5.5 0 0 0 .8-.4V8a2 2 0 0 0-2-2H9V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v12a.5.5 0 1 0 1 0V5a2 2 0 0 0-2-2h-9zM5 8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v12.98l-5.2-4a.5.5 0 0 0-.6 0l-5.2 4V8z"
        fill="#757575"
      ></path>
    </svg>
  );
}
function Readinglist() {
  return (
    <svg
      className="cursor-not-allowed  text-gray-800 hover:text-black duration-100"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Lists"
    >
      <path
        d="M4.5 6.25V21c0 .2.24.32.4.2l5.45-4.09a.25.25 0 0 1 .3 0l5.45 4.09c.16.12.4 0 .4-.2V6.25a.25.25 0 0 0-.25-.25H4.75a.25.25 0 0 0-.25.25z"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
      <path
        d="M8 6V3.25c0-.14.11-.25.25-.25h11.5c.14 0 .25.11.25.25V16.5"
        stroke="currentColor"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}
