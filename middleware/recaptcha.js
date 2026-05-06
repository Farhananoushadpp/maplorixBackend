// reCAPTCHA verification middleware
export const verifyRecaptcha = async (req, res, next) => {
  try {
    // Skip reCAPTCHA verification if explicitly disabled via env var
    if (process.env.RECAPTCHA_ENABLED === "false") {
      return next();
    }

    // Skip reCAPTCHA verification in development unless explicitly enabled
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ENABLE_RECAPTCHA_IN_DEV !== "true"
    ) {
      return next();
    }

    // Get reCAPTCHA token from request body
    const captchaToken =
      req.body?.recaptchaToken || req.body?.gRecaptchaResponse;

    if (!captchaToken || captchaToken === "undefined" || captchaToken === "") {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message:
          "reCAPTCHA verification is required. Please complete the reCAPTCHA challenge.",
      });
    }

    // Get reCAPTCHA secret key from environment
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

    if (
      !recaptchaSecret ||
      recaptchaSecret === "your_recaptcha_secret_key_here"
    ) {
      console.error("reCAPTCHA secret key is not configured");
      return res.status(500).json({
        success: false,
        error: "Server Configuration Error",
        message:
          "reCAPTCHA is not properly configured. Please contact support.",
      });
    }

    // Verify token with Google's reCAPTCHA API
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: recaptchaSecret,
        response: captchaToken,
        // remoteip removed — can cause rejection behind reverse proxies
      }),
    });

    const recaptchaData = await recaptchaResponse.json();

    console.log("[reCAPTCHA] Google response:", JSON.stringify(recaptchaData));

    if (!recaptchaData.success) {
      const errorCodes = recaptchaData["error-codes"] || [];
      console.error(
        "[reCAPTCHA] Verification FAILED. Error codes:",
        errorCodes,
      );
      console.error(
        "[reCAPTCHA] Token (first 20 chars):",
        captchaToken?.substring(0, 20),
      );
      console.error(
        "[reCAPTCHA] Secret key (first 10 chars):",
        recaptchaSecret?.substring(0, 10),
      );

      // Map Google error codes to human-readable messages
      const errorMessages = {
        "missing-input-secret": "reCAPTCHA secret key is missing",
        "invalid-input-secret": "reCAPTCHA secret key is invalid",
        "missing-input-response": "reCAPTCHA token is missing",
        "invalid-input-response": "reCAPTCHA token is invalid or expired",
        "bad-request": "reCAPTCHA request is malformed",
        "timeout-or-duplicate":
          "reCAPTCHA token has expired or was already used",
      };

      const userMessage = errorCodes.length
        ? errorMessages[errorCodes[0]] || "reCAPTCHA verification failed"
        : "reCAPTCHA verification failed. Please try again.";

      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: userMessage,
        details: errorCodes,
      });
    }

    // Check score for reCAPTCHA v3 (if using v3)
    if (recaptchaData.score !== undefined) {
      const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE) || 0.5;
      if (recaptchaData.score < minScore) {
        console.error(
          `reCAPTCHA score too low: ${recaptchaData.score} < ${minScore}`,
        );
        return res.status(400).json({
          success: false,
          error: "Validation Error",
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }
    }

    // reCAPTCHA verification successful
    req.recaptchaData = recaptchaData;
    next();
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return res.status(500).json({
      success: false,
      error: "Server Error",
      message: "Failed to verify reCAPTCHA. Please try again.",
    });
  }
};

// Optional: reCAPTCHA middleware for development testing
export const verifyRecaptchaDev = async (req, res, next) => {
  // In development, you might want to bypass reCAPTCHA or use a test token
  if (process.env.NODE_ENV === "development") {
    const testToken = req.body?.recaptchaToken || req.body?.gRecaptchaResponse;

    // Accept common test tokens in development
    const devTestTokens = ["test", "dev", "localhost", "debug"];

    if (!testToken || devTestTokens.includes(testToken.toLowerCase())) {
      // Mock successful reCAPTCHA verification for development
      req.recaptchaData = {
        success: true,
        score: 0.9,
        action: "submit",
      };
      return next();
    }
  }

  // Fall back to production verification
  return verifyRecaptcha(req, res, next);
};
