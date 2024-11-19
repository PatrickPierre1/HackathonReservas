export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div>
                    <h1>Login Layout</h1>
                    {children}
                </div>
            </body>
        </html>
    );
}