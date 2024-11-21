"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
	const router = useRouter();
	const nome = localStorage.getItem('unialfa.nome');
	const permissoes = localStorage.getItem('unialfa.permissoes');

	useEffect(() => {
		const token = localStorage.getItem('unialfa.token');
		if (!token) {
			router.replace('/login');
		}
	}, [router]);
	return (
		<>
			<div>
				Dashboard
			</div>
		</>
	);
}
