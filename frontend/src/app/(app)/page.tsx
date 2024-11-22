"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const router = useRouter();
	const [isClient, setIsClient] = useState(false);

	const [nome, setNome] = useState<string | null>(null);
	const [permissoes, setPermissoes] = useState<string | null>(null);

	useEffect(() => {
		setIsClient(true);
		const token = localStorage.getItem('unialfa.token');
		if (!token) {
			router.replace('/login');
		} else {
			setNome(localStorage.getItem('unialfa.nome'));
			setPermissoes(localStorage.getItem('unialfa.permissoes'));
		}
	}, [router]);

	if (!isClient) {
		return null;
	}

	return (
		<>
			<div>
				<h1>Dashboard</h1>
			</div>
		</>
	);
}
