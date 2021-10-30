import "./Header.scss";

type Props = {
  large?: boolean;
};

export const Header = (props: Props) => {
  return (
    <div className="logo">
      <b>
        <span>b</span>
        <span>in</span>
        <span>q</span>
        <span>u</span>
        <span>i</span>
        <span>z</span>
      </b>
    </div>
    // <p className='logo'>Binquiz</p>
  );
};
