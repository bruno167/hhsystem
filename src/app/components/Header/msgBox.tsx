interface MsgBoxProps { onClick: () => void;

}
export default function MsgBox(props : MsgBoxProps){
    return(
        <div className="dropdown-msg">
            <span> 
                <p>Não há nada por aqui !</p>
            </span>
        </div>
    )
}