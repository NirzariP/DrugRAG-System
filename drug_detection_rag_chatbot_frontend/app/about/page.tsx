export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About DrugRAG</h1>
        <p className="text-gray-600 text-lg leading-8">
          We are a group of developers passionate about applying AI to solve
          real-world problems in healthcare. This project was built as an effort
          to address a gap we noticed in existing drug interaction tools — most
          of them only cover drug-to-drug interactions, leaving out equally
          important factors like food and medicinal herb interactions. To tackle
          this, we built a RAG-based application that combines multiple
          datasets, including data from Kaggle and the Diet-Drug Interaction
          Database (DDID), covering over 1,500 drugs, 270 foods, and 1,000+
          Chinese medicinal herbs. The system is designed to understand the
          context of a users query, extract the relevant parameters, and
          retrieve the most accurate interaction data available. We kept the
          user in the loop at every step — the system confirms the interpreted
          query before generating a response, which helps catch errors like
          misspellings or ambiguous inputs. We also built in a caching layer to
          avoid redundant processing for repeated queries.
        </p>
      </div>
    </div>
  );
}
