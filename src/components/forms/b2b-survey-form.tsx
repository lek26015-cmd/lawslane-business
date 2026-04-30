'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Loader2 } from 'lucide-react';

const formSchema = z.object({
  role: z.enum(['executive', 'inhouse_legal', 'other'], {
    required_error: 'กรุณาเลือกบทบาทของคุณ',
  }),
  contractVolume: z.enum(['<10', '10-30', '31-50', '>50'], {
    required_error: 'กรุณาเลือกปริมาณสัญญาเฉลี่ยต่อเดือน',
  }),
  currentTool: z.string().min(2, {
    message: 'เครื่องมือปัจจุบันต้องมีอย่างน้อย 2 ตัวอักษร',
  }),
  challenges: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'คุณต้องเลือกความท้าทายอย่างน้อยหนึ่งข้อ',
  }),
  workspaceHelpfulness: z.coerce.number().min(1).max(5, {
    message: 'กรุณาให้คะแนนระหว่าง 1 ถึง 5',
  }),
  aiTimeSaved: z.enum(['<20%', '20-40%', '40-60%', '>60%'], {
    required_error: 'กรุณาเลือกการคาดการณ์เวลาที่ AI จะช่วยประหยัดได้',
  }),
  aiConcerns: z.string().min(1, { message: 'กรุณาระบุข้อกังวลของคุณ' }),
  spendTrackingMethod: z.string().min(1, { message: 'กรุณาเลือกวิธีการติดตามค่าใช้จ่าย' }),
  spendTrackingNeed: z.string().min(1, { message: 'กรุณาเลือกระดับความต้องการในการติดตามค่าใช้จ่าย' }),
  outsourceInterest: z.string().min(1, { message: 'กรุณาเลือกระดับความสนใจในการจ้างงานภายนอก' }),
  decisionFactor: z.string().min(1, { message: 'กรุณาเลือกปัจจัยหลักในการตัดสินใจ' }),
});

const CHALLENGES = [
  { id: 'drafting', label: 'ร่างสัญญาใหม่ตั้งแต่ต้น' },
  { id: 'reviewing', label: 'ตรวจสอบ / แก้ไขสัญญา' },
  { id: 'approval', label: 'ความล่าช้าในขั้นตอนการอนุมัติ' },
  { id: 'storage', label: 'การจัดเก็บ / ค้นหาเอกสาร' },
  { id: 'compliance', label: 'การติดตามการปฏิบัติตามข้อกำหนด' },
];

export function B2BSurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentTool: '',
      challenges: [],
      aiConcerns: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'b2b_survey_responses'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      // Optional: Add a toast notification for error here
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center py-12">
        <CardContent className="space-y-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">ขอบคุณสำหรับความคิดเห็นของคุณ!</CardTitle>
          <CardDescription className="text-base">
            ระบบได้บันทึกข้อมูลของคุณแล้ว ข้อมูลนี้จะช่วยให้เราสร้างสรรค์ Legal OS ที่ดียิ่งขึ้นสำหรับคุณ
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-[#002f4b]">แบบสำรวจการดำเนินงานด้านกฎหมายสำหรับองค์กร (B2B)</CardTitle>
        <CardDescription>
          ช่วยให้เราเข้าใจความท้าทายในการทำงานด้านกฎหมายของคุณ เพื่อให้เราสามารถปรับปรุงระบบให้ตรงกับความต้องการของคุณได้
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>บทบาทของคุณ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกบทบาทของคุณ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="executive">ผู้บริหารระดับสูง (C-Level)</SelectItem>
                        <SelectItem value="inhouse_legal">ที่ปรึกษากฎหมายภายในองค์กร</SelectItem>
                        <SelectItem value="other">อื่นๆ / ฝ่ายปฏิบัติการ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contract Volume */}
              <FormField
                control={form.control}
                name="contractVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ปริมาณสัญญาเฉลี่ยต่อเดือน</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกปริมาณสัญญา" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="<10">น้อยกว่า 10</SelectItem>
                        <SelectItem value="10-30">10 ถึง 30</SelectItem>
                        <SelectItem value="31-50">31 ถึง 50</SelectItem>
                        <SelectItem value=">50">มากกว่า 50</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Current Tool */}
            <FormField
              control={form.control}
              name="currentTool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เครื่องมือหรือระบบจัดการสัญญาที่ใช้อยู่ในปัจจุบัน</FormLabel>
                  <FormControl>
                    <Input placeholder="เช่น Word, Google Docs, Ironclad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Challenges */}
            <FormField
              control={form.control}
              name="challenges"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">ความท้าทายที่ใหญ่ที่สุดในการทำงาน</FormLabel>
                    <CardDescription>เลือกได้มากกว่า 1 ข้อ</CardDescription>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHALLENGES.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="challenges"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace Helpfulness */}
            <FormField
              control={form.control}
              name="workspaceHelpfulness"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>คุณคิดว่าระบบพื้นที่ทำงานด้านกฎหมายแบบครบวงจรจะมีประโยชน์มากน้อยเพียงใด? (1 = ไม่มีประโยชน์, 5 = มีประโยชน์มากที่สุด)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      className="flex space-x-4"
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <FormItem className="flex items-center space-x-2 space-y-0" key={val}>
                          <FormControl>
                            <RadioGroupItem value={val.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">{val}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Time Saved */}
            <FormField
              control={form.control}
              name="aiTimeSaved"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>คุณคาดหวังให้ AI ช่วยประหยัดเวลาในการตรวจสัญญาได้มากน้อยแค่ไหน?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      {['<20%', '20-40%', '40-60%', '>60%'].map((val) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 border p-3 rounded-md" key={val}>
                          <FormControl>
                            <RadioGroupItem value={val} />
                          </FormControl>
                          <FormLabel className="font-normal w-full cursor-pointer">{val}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Concerns */}
            <FormField
              control={form.control}
              name="aiConcerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ข้อกังวลที่ใหญ่ที่สุดของคุณเกี่ยวกับการนำ AI มาใช้ในงานด้านกฎหมายคืออะไร?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="เช่น ความเป็นส่วนตัวของข้อมูล, ความแม่นยำ, ขาดการควบคุมโดยมนุษย์..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Spend Tracking Method */}
              <FormField
                control={form.control}
                name="spendTrackingMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ปัจจุบันคุณติดตามค่าใช้จ่ายด้านกฎหมายอย่างไร?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {[
                          { value: 'Spreadsheets', label: 'สเปรดชีต (Spreadsheets)' },
                          { value: 'ERP Software', label: 'โปรแกรม ERP' },
                          { value: 'Specialized Legal Tool', label: 'เครื่องมือด้านกฎหมายเฉพาะทาง' },
                          { value: 'None', label: 'ไม่ได้ติดตาม' }
                        ].map((item) => (
                          <FormItem className="flex items-center space-x-3 space-y-0" key={item.value}>
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Spend Tracking Need */}
              <FormField
                control={form.control}
                name="spendTrackingNeed"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ความต้องการระบบติดตามค่าใช้จ่ายด้านกฎหมายที่ดีขึ้น?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {[
                          { value: 'High', label: 'สูง' },
                          { value: 'Medium', label: 'ปานกลาง' },
                          { value: 'Low', label: 'ต่ำ' },
                          { value: 'Not a priority', label: 'ไม่ใช่สิ่งสำคัญในตอนนี้' }
                        ].map((item) => (
                          <FormItem className="flex items-center space-x-3 space-y-0" key={item.value}>
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Outsource Interest */}
              <FormField
                control={form.control}
                name="outsourceInterest"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ความสนใจในการจ้างงานด้านกฎหมายภายนอกผ่านแพลตฟอร์มของเรา?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {[
                          { value: 'High Interest', label: 'สนใจมาก' },
                          { value: 'Moderate Interest', label: 'สนใจปานกลาง' },
                          { value: 'Low Interest', label: 'สนใจน้อย' },
                          { value: 'None', label: 'ไม่สนใจ' }
                        ].map((item) => (
                          <FormItem className="flex items-center space-x-3 space-y-0" key={item.value}>
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Decision Factor */}
              <FormField
                control={form.control}
                name="decisionFactor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ปัจจัยหลักในการเลือกที่ปรึกษากฎหมายภายนอก?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {[
                          { value: 'Cost / Value', label: 'ราคา / ความคุ้มค่า' },
                          { value: 'Speed of Delivery', label: 'ความรวดเร็วในการให้บริการ' },
                          { value: 'Industry Expertise', label: 'ความเชี่ยวชาญในอุตสาหกรรม' },
                          { value: 'Reliability / Reputation', label: 'ความน่าเชื่อถือ / ชื่อเสียง' }
                        ].map((item) => (
                          <FormItem className="flex items-center space-x-3 space-y-0" key={item.value}>
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-[#002f4b] hover:bg-[#004a75]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังส่ง...
                </>
              ) : (
                'ส่งแบบสำรวจ'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
