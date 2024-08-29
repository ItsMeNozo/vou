import React from "react";

const QuizGameLanding: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center animate-bgcolor">
      <h1 className=" text-5xl text-white mb-10">Join a Game</h1>
      <form action="/quiz-game/player/" className="w-full max-w-md">
        <div className="mb-6">
          <label className="block text-center text-2xl  text-white mb-2">
            Display Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            autoFocus
            className="w-full p-3 border border-gray-300 rounded text-xl text-center"
          />
        </div>
        <div className="mb-6">
          <label className="block text-center text-2xl  text-white mb-2">
            Game Pin
          </label>
          <input
            id="pin"
            type="number"
            name="pin"
            className="w-full p-3 border border-gray-300 rounded text-xl text-center"
          />
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-4 rounded text-xl "
          >
            Join
          </button>
        </div>
      </form>
      <a href="/quiz-game/create" className="text-white underline mt-4">
        Click here to host a Kahoot!
      </a>
    </div>
  );
};

export default QuizGameLanding;
