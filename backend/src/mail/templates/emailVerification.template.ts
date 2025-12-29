const emailVerificationTemplate = (verificationUrl: string) => {
  return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Account Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<a href="#"><img class="logo"
					src="https://res.cloudinary.com/dfjebssoc/image/upload/v1762089978/Colorful_Abstract_Brain_Illustrative_Technology_Ai_Logo_abxgcv.png" alt="Brainly Logo"></a>
			<div class="message">Account Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with Brainly. To complete your registration, please use the following Link to verify your account:</p>
				<h2 class="highlight">
                    <button><a href='${verificationUrl}'>Click here</a></button>
                </h2>
				<p>This Link is valid for 10 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
            <div>Link - ${verificationUrl}</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at 
                <a href="mailto:oneaudiobook1@gmail.com">OneAudioBook1@gmail.com</a>. We are here to help!
            </div>
        </div>
	</body>
	</html>`;
};

export default emailVerificationTemplate;
