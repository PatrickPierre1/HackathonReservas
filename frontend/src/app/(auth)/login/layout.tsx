import "../../(app)/global.css";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div>
                    {children}
                </div>
            </body>
        </html>
    );
}