import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string };
}) => {
    try {
        searchParams.page ||= "1";

        const queries = [
            Query.equal("authorId", params.userId),
            Query.orderDesc("$createdAt"),
            Query.offset((+searchParams.page - 1) * 25),
            Query.limit(25),
        ];

        // Fetch answers with fail-safe
        const answers = await databases
            .listDocuments(db, answerCollection, queries)
            .catch(() => ({ total: 0, documents: [] })); // Prevents crashes if API fails

        console.log("Answers:", answers);

        // Fetch related questions in parallel with fault tolerance
        answers.documents = await Promise.all(
            answers.documents.map(async ans => {
                const question = await databases
                    .getDocument(db, questionCollection, ans.questionId, [Query.select(["title"])])
                    .catch(() => ({ title: "Unknown Question", $id: ans.questionId }));

                return { ...ans, question };
            })
        );

        return (
            <div className="px-4">
                {/* Answers Count */}
                <div className="mb-4">
                    <p>{answers.total} answers</p>
                </div>

                {/* Answers List */}
                <div className="mb-4 max-w-3xl space-y-6">
                    {answers.documents.length > 0 ? (
                        answers.documents.map(ans => (
                            <div key={ans.$id} className="border-b pb-4">
                                <div className="max-h-40 overflow-auto">
                                    <MarkdownPreview source={ans.content ?? ""} className="rounded-lg p-4" />
                                </div>
                                <Link
                                    href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                                    className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                                >
                                    View Question
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No answers found.</p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination total={answers.total} limit={25} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching answers:", error);
        return (
            <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
                Failed to load answers.
            </div>
        );
    }
};

export default Page;
