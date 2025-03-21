import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
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

        // Fetch questions with fail-safe
        const questions = await databases
            .listDocuments(db, questionCollection, queries)
            .catch(() => ({ total: 0, documents: [] })); // Prevents crash if API fails

        console.log("Questions:", questions);

        // Process each question
        questions.documents = await Promise.all(
            questions.documents.map(async ques => {
                const [author, answers, votes] = await Promise.all([
                    users.get<UserPrefs>(ques.authorId).catch(() => ({
                        $id: "unknown",
                        prefs: { reputation: 0 },
                        name: "Unknown User",
                    })),
                    databases
                        .listDocuments(db, answerCollection, [
                            Query.equal("questionId", ques.$id),
                            Query.limit(1),
                        ])
                        .catch(() => ({ total: 0 })),
                    databases
                        .listDocuments(db, voteCollection, [
                            Query.equal("type", "question"),
                            Query.equal("typeId", ques.$id),
                            Query.limit(1),
                        ])
                        .catch(() => ({ total: 0 })),
                ]);

                return {
                    ...ques,
                    totalAnswers: answers?.total ?? 0,
                    totalVotes: votes?.total ?? 0,
                    author: {
                        $id: author?.$id ?? "unknown",
                        reputation: author?.prefs?.reputation ?? 0,
                        name: author?.name ?? "Unknown User",
                    },
                };
            })
        );

        return (
            <div className="px-4">
                {/* Questions Count */}
                <div className="mb-4">
                    <p>{questions.total} questions</p>
                </div>

                {/* Questions List */}
                <div className="mb-4 max-w-3xl space-y-6">
                    {questions.documents.length > 0 ? (
                        questions.documents.map(ques => (
                            <QuestionCard key={ques.$id} ques={ques} />
                        ))
                    ) : (
                        <p className="text-gray-500">No questions found.</p>
                    )}
                </div>

                {/* Pagination */}
                <Pagination total={questions.total} limit={25} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching questions:", error);
        return (
            <div className="flex h-screen items-center justify-center text-xl font-semibold text-red-600">
                Failed to load questions.
            </div>
        );
    }
};

export default Page;
