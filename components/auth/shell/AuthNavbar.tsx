'use client';

export default function AuthNavbar() {
  return (
    <div className="navbar">
      <div className="navInner">
        <a className="brand" href="/">QUICK</a>

        <div className="navRight">
          <a className="navBtn" href="/demo">DEMO</a>
          <a className="navBtn" href="/students">STUDENTS</a>
          <a className="navBtn" href="/agencies">AGENCIES</a>
          <a className="navBtn" href="/faq">FAQ</a>
          <a className="navBtn" href="/auth/login">LOGIN</a>

          <div className="lang" aria-label="Language">
            <button className="active" type="button">EN</button>
            <button type="button">中</button>
          </div>
        </div>
      </div>
    </div>
  );
}
