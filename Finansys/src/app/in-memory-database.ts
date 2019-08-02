import { InMemoryDbService } from "angular-in-memory-web-api";

export class InMemoryDatabase implements InMemoryDbService{

    createDb() {
        const categories = [
            { id: 1, name: 'Moradia', description: "Pagamentos de contas de casa" },
            { id: 2, name: 'Saúde', description: "Plano de saúde e remédios" },
            { id: 3, name: 'Lazer', description: "Cinema, parques, viagens, etc" },
            { id: 4, name: 'Salário', description: "Recebimento do salário" },
            { id: 5, name: 'Freelas', description: "Trabalhos freelancer" }
        ];
        return { categories }
    }

}