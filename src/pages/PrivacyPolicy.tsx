import { useGetPageQuery } from "@/queries/settings.ts";

const PrivacyPolicy = () => {
    const { data, isLoading, isError } = useGetPageQuery("privacy-policy");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-destructive">Failed to load privacy policy.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-107.5 min-h-screen relative overflow-x-hidden p-5">
            <h1 className="mb-6 text-2xl font-semibold">{data.name}</h1>
            <style>{`
                .quill-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
                .quill-content ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
                .quill-content li { margin: 0.25em 0; }
                .quill-content h1 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
                .quill-content h2 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
                .quill-content p { margin: 0.5em 0; }
                .quill-content a { color: #0066ff; text-decoration: underline; }
                .quill-content strong { font-weight: 700; }
                .quill-content em { font-style: italic; }
            `}</style>
            <div
                className="quill-content"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </div>
    );
};

export default PrivacyPolicy;