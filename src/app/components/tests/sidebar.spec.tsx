import { render, screen } from "@testing-library/react";
import { SideBar } from "../Sidebar/sidebar";


describe("Sidebar", () => {
    it("should render correctly", () => {
        render(<SideBar />)

        expect(screen.getByText("Dashboard")).tobeInTheDocument();
        expect(screen.getByText("Cadastro")).toBeInTheDocument();
        expect(screen.getByText("Gerenciar")).toBeInTheDocument();
        expect(screen.getByText("Configurações")).toBeInTheDocument();
        expect(screen.getByText("FAQ")).toBeInTheDocument();
        expect(screen.getByText("Sair")).toBeInTheDocument();
    })
    
})