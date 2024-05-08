import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import "./dashboard.scss"

interface ProfissionalSaude {
    id: number;
    nome: string;
    valorConsulta: number;
    especialidade: string;
    ativo: '';
}

interface DashboardProps {
    profissionais: ProfissionalSaude[];
}

const Dashboard: React.FC<DashboardProps> = ({ profissionais }) => {
    useEffect(() => {
        const ctx = document.getElementById('consulta-chart') as HTMLCanvasElement;
        let existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const data = profissionais.map(profissional => profissional.valorConsulta);
        const labels = profissionais.map(profissional => profissional.nome);
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valor da Consulta',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value: number) {
                                return 'R$' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        };
        new Chart(ctx, config);
    }, [profissionais]);

    const ativos = profissionais.filter(profissional => profissional.ativo).length;
    const inativos = profissionais.length - ativos;
    const mediaConsulta = profissionais.reduce((acc, profissional) => acc + profissional.valorConsulta, 0) / profissionais.length;
    const minConsulta = Math.min(...profissionais.map(profissional => profissional.valorConsulta));
    const maxConsulta = Math.max(...profissionais.map(profissional => profissional.valorConsulta));

    return (
        <div className="content">
            <h2>Dashboard</h2>
            <canvas id="consulta-chart"></canvas>
        </div>
    );
};

const DashboardContainer: React.FC = () => {
    const [profissionais, setProfissionais] = useState<ProfissionalSaude[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ProfissionalSaude[]>('http://localhost:3000/profissionais');
                setProfissionais(response.data);
            } catch (error) {
                console.error('Erro ao buscar profissionais:', error);
            }
        };

        fetchData();
    }, []);

    return <Dashboard profissionais={profissionais} />;
};

export default DashboardContainer;
