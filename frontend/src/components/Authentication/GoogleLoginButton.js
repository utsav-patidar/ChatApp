// GoogleLoginButton.js
import React from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  const clientId =
    "1020204914304-iuphoktl3pvfd5p04jjqddfv395t5ei9.apps.googleusercontent.com"; // Replace with your client ID

  const handleSuccess = (response) => {
    // Handle successful Google login
    onSuccess(response);
  };

  const handleFailure = (error) => {
    // Handle failed Google login
    onFailure(error);
  };
  function start() {
    gapi.client.init({
      clientId: clientId,
      scope: "",
    });
  }
  const gapiCall = () => {
    gapi.load("client:auth2", start);
  };
  return (
    <div onClick={gapiCall()}>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
};

export default GoogleLoginButton;
