export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const isProduction = process.env.NODE_ENV === "production" || !process.env.NODE_ENV;
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 5;
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true, // Always true for Vercel https
    sameSite: "none",
    path: "/",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
