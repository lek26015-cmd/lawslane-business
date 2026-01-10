'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Book } from '@/lib/education-types';

// Reuse mock data or fetch
const RECOMMENDED_BOOKS: Book[] = [
    {
        id: "1",
        title: "คู่มือเตรียมสอบใบอนุญาตว่าความ (ภาคทฤษฎี)",
        description: "สรุปเนื้อหาสำคัญสำหรับสอบภาคทฤษฎี ครบถ้วน เข้าใจง่าย พร้อมตัวอย่างข้อสอบ",
        price: 350,
        coverUrl: "https://placehold.co/400x600/e2e8f0/1e293b?text=Lawyer+License",
        author: "อ.สมชาย กฎหมายแม่น",
        stock: 50,
        isDigital: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        title: "รวมข้อสอบตั๋วทนาย 10 ปีย้อนหลัง",
        description: "เจาะลึกข้อสอบเก่า พร้อมเฉลยละเอียดและวิเคราะห์ประเด็นสำคัญ",
        price: 450,
        coverUrl: "https://placehold.co/400x600/e2e8f0/1e293b?text=Exam+History",
        author: "ทีมงาน Lawlanes",
        stock: 20,
        isDigital: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        title: "E-Book: เทคนิคการร่างฟ้องและคำร้อง",
        description: "เทคนิคระดับมือโปรสำหรับการร่างเอกสารทางกฎหมาย (รูปแบบ PDF)",
        price: 199,
        coverUrl: "https://placehold.co/400x600/e2e8f0/1e293b?text=E-Book",
        author: "ทนายวิชัย",
        stock: 999,
        isDigital: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export function RecommendedBooksSection() {
    return (
        <section className="py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-slate-600" />
                    <h2 className="text-2xl font-bold text-slate-900">หนังสือน่าอ่าน</h2>
                </div>
                <Link href="/education/books">
                    <Button variant="link" className="text-slate-600 hover:text-primary">
                        ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RECOMMENDED_BOOKS.map((book) => (
                    <Card key={book.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden border-slate-200">
                        <div className="relative aspect-[2/3] w-full bg-slate-100 overflow-hidden">
                            {/* In a real app, use Image component with proper optimization */}
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                            />
                            {book.isDigital && (
                                <Badge className="absolute top-2 right-2 bg-blue-600 shadow-sm">E-Book</Badge>
                            )}
                        </div>
                        <CardContent className="flex-1 p-5">
                            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 min-h-[3.5rem] text-slate-900">
                                {book.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                                {book.description}
                            </p>
                            <div className="text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">
                                โดย {book.author}
                            </div>
                        </CardContent>
                        <CardFooter className="p-5 pt-0 flex items-center justify-between mt-auto">
                            <span className="text-xl font-bold text-indigo-700">
                                ฿{book.price.toLocaleString()}
                            </span>
                            <Link href={`/education/books/${book.id}`}>
                                <Button size="sm" className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                                    ดูรายละเอียด
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
