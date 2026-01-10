import { Book } from "@/lib/education-types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookPurchaseSection } from "../../components/book-purchase-section";

// MOCK DATA (Same as listing for consistency)
import { getBookById } from "@/lib/education-data-admin";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await getBookById(id);

    if (!book) {
        return notFound();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Breadcrumb / Back */}
            <Link href="/education/books" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                ย้อนกลับไปร้านหนังสือ
            </Link>

            <div className="grid md:grid-cols-12 gap-10">
                {/* Left Column: Image */}
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl bg-slate-100 mb-6">
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="object-cover w-full h-full"
                        />
                        {book.isDigital && (
                            <Badge className="absolute top-4 right-4 bg-blue-600 text-lg px-3 py-1">E-Book</Badge>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{book.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
                                ผู้แต่ง: {book.author}
                            </span>
                            {book.publisher && (
                                <span>สำนักพิมพ์: {book.publisher}</span>
                            )}
                            {book.publishedAt && (
                                <span>ตีพิมพ์: {book.publishedAt.toLocaleDateString('th-TH')}</span>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-lg font-semibold">รายละเอียดหนังสือ</h3>
                        <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                            {book.description}
                        </p>
                    </div>

                    {/* Book Metadata */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                        {book.isbn && (
                            <div>
                                <p className="text-xs text-slate-400">ISBN</p>
                                <p className="font-medium">{book.isbn}</p>
                            </div>
                        )}
                        {book.pageCount && (
                            <div>
                                <p className="text-xs text-slate-400">จำนวนหน้า</p>
                                <p className="font-medium">{book.pageCount} หน้า</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-slate-400">รูปแบบ</p>
                            <p className="font-medium">{book.isDigital ? "ไฟล์ PDF" : "เล่มจริง"}</p>
                        </div>
                    </div>

                    {/* Client Component for Purchase Actions */}
                    <BookPurchaseSection book={book} />
                </div>
            </div>
        </div>
    );
}
