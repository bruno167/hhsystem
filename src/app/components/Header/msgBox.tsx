/* No arquivo MsgBox.tsx */
import "./msgBox.scss";
import { MessageCircle } from "lucide-react";

interface MsgBoxProps {
    onClick: () => void;
}

export default function MsgBox(props: MsgBoxProps) {
    return (
        <div className="msgbox">
            <ul>
                <h3 className="msg-title">Mensagens</h3>
                {/* Exemplo de item de mensagem */}
                <li className="msg-item">
                    <a href="#">
                        <MessageCircle className="msg-icon" />
                        Nova mensagem
                    </a>
                </li>
            </ul>
        </div>
    );
}
