import React from "react";
import { Button } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Logo from "../components/ErrorLogo";
import { Link } from "react-router-dom";

function Errorpage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fadeIn = () => {
    if (window.scrollY > 100) {
      onOpen();
    } else {
      onClose();
    }
    console.log(window.scrollY);
    console.log(isOpen);
  };

  window.addEventListener("scroll", fadeIn);
  return (
    <>
      <br />
      <br />
      <div className="error-logo-pos">
        <Logo className="App-logo" />

        <div className="App-header">
          <div>4</div>
          <div>0</div>
          <div>4</div>
        </div>

        <p className="paragraph-error">
          Uh oh, you must be lost! time to go back...
        </p>
        <br />
        <br />
        <Fade in={isOpen}>
          <Link to="/">
            <Button> Home </Button>
          </Link>
        </Fade>
      </div>
      <br />
      <br />
    </>
  );
}
export default Errorpage;
