import React, { Component } from "react";
import Lottie from "react-lottie";
import talkingMC from "@/assets/lotties/talkingMC.json";
import idleMC from "@/assets/lotties/idleMC.json";

class AnimatedTalkingMC extends Component {
  state = { isStopped: false, isPaused: false };

  defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: talkingMC,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  render() {
    return (
      <Lottie
        options={this.defaultOptions}
        isStopped={this.state.isStopped}
        isPaused={this.state.isPaused}
        height={300}
        width={300}
      />
    );
  }
}

class AnimatedIdleMC extends Component {
  state = { isStopped: false, isPaused: false };

  defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: idleMC,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  render() {
    return (
      <Lottie
        options={this.defaultOptions}
        isStopped={this.state.isStopped}
        isPaused={this.state.isPaused}
        height={300}
        width={300}
      />
    );
  }
}

export { AnimatedTalkingMC, AnimatedIdleMC };
