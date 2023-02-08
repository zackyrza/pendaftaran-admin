import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Ada error yang terjadi.</p>
      <p>
        <i>Silahkan hubungi admin atau coba lagi nanti</i>
      </p>
    </div>
  );
}
