const HelpInstructions = () => {
  return (
    <div className="z-50 bg-purple-200 bg-opacity-50 border border-purple-500 p-2 rounded-md text-white text-sm leading-5">
      <h2 className="text-red-700 text-lg leading-7">
        Frontend Shaking Game Instructions
      </h2>

      <p className="text-purple-900">
        <strong>Home Screen:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>
          <strong>Play:</strong> Shake your phone for 5 seconds to receive a
          random item.
        </li>
      </ul>
      <p className="text-purple-900">
        <strong>Game Play:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>Shake your phone to collect dropping gifts.</li>
      </ul>
      <p className="text-purple-900">
        <strong>Item Collection:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>View and manage your collected items.</li>
        <li>
          Use the <strong>Mix Option</strong> to receive a voucher and exit the
          game for this event.
        </li>
      </ul>
      <p className="text-purple-900">
        <strong>Gift Option:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>Enable by clicking on an item.</li>
        <li>Send gifts by providing a phone number, email, or user ID.</li>
      </ul>
      <p className="text-purple-900">
        <strong>Additional Play Attempts:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>If you run out of attempts:</li>
        <ul className="ml-6 text-purple-900">
          <li>Share the event on Facebook to get more attempts.</li>
          <li>Request more attempts from friends.</li>
        </ul>
      </ul>
      <p className="text-purple-900">
        <strong>Notifications:</strong>
      </p>
      <ul className="ml-6 text-purple-900">
        <li>Stay updated on accepted play requests and gifted items.</li>
      </ul>
    </div>
  );
};

export default HelpInstructions;
