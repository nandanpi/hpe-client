"use client";
import Urlanaysis from "./components/url-analysis";

export default function HomePage() {
  return (
    <>
      {/* <Header /> */}
      <div className="bg-background text-foreground min-h-screen space-y-4 px-4 py-4">
        <section className="max-w-8xl bg-card border-border mx-auto rounded-xl border p-6 shadow-sm">
          <Urlanaysis />
        </section>

        {/* <CSVUpload
          onAnalyze={function (data: { [x: string]: string }[]): void {
            throw new Error("Function not implemented.");
          }}
        /> */}
        {/* <Footer /> */}
      </div>
    </>
  );
}
