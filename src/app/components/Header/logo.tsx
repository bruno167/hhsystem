interface LogoProps {

}
export default function Logo(props : LogoProps){
    return(
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12l-4-4v3H3v2h15v3l4-4z" />
        <circle cx="17" cy="12" r="1" />
        <circle cx="7" cy="12" r="1" />
      </svg>

    )
}