import pandas as pd
import os

# CSV dosyasını oku
df = pd.read_csv('new.csv')  # Dosya adınızı buraya yazın

# classes klasörü oluştur (eğer yoksa)
if not os.path.exists('classes'):
    os.makedirs('classes')

# Benzersiz class'ları al
unique_classes = df['class'].unique()

# 50 altında olan class'ları birleştirmek için liste
small_classes_data = []
files_to_delete = []

print("Class'lar işleniyor...")
print("-" * 50)

# Her class için ayrı dosya oluştur
for word_class in unique_classes:
    # Bu class'a ait verileri filtrele
    class_data = df[df['class'] == word_class]
    
    # İstenen sütunları seç (class sütununu çıkar)
    output_data = class_data[['word', 'level', 'sentence', 'word_mean']]
    
    # Dosya adını oluştur (özel karakterleri temizle)
    safe_class_name = str(word_class).replace('/', '_').replace(' ', '_')
    filename = f'classes/{safe_class_name}_words.csv'
    
    # Kelime sayısını kontrol et
    word_count = len(class_data)
    
    if word_count < 50:
        print(f'{word_class}: {word_count} kelime (50 altı - birleştirilecek)')
        # 50 altında olanları listeye ekle, class bilgisini de ekle
        output_data_with_class = class_data[['word', 'class', 'level', 'sentence', 'word_mean']]
        small_classes_data.append(output_data_with_class)
        files_to_delete.append(filename)
        
        # Yine de dosyayı oluştur (sonra silinecek)
        output_data.to_csv(filename, index=False)
    else:
        print(f'{word_class}: {word_count} kelime (50 üzeri - ayrı dosya)')
        # CSV dosyasını kaydet
        output_data.to_csv(filename, index=False)

print("-" * 50)

# 50 altındaki class'ları birleştir
if small_classes_data:
    combined_small_classes = pd.concat(small_classes_data, ignore_index=True)
    combined_filename = 'classes/small_classes_combined.csv'
    combined_small_classes.to_csv(combined_filename, index=False)
    print(f'50 altında {len(small_classes_data)} class birleştirildi.')
    print(f'Toplam {len(combined_small_classes)} kelime {combined_filename} dosyasına kaydedildi.')
else:
    print('50 altında class bulunamadı.')

print("-" * 50)

# 50 altındaki dosyaları sil
deleted_count = 0
for filename in files_to_delete:
    try:
        os.remove(filename)
        deleted_count += 1
        print(f'Silindi: {filename}')
    except FileNotFoundError:
        print(f'Dosya bulunamadı: {filename}')

print("-" * 50)
print(f'İşlem tamamlandı!')
print(f'- {deleted_count} adet 50 altı dosya silindi')
print(f'- 50 üzeri class\'lar ayrı dosyalarda tutuldu')
if small_classes_data:
    print(f'- 50 altı class\'lar small_classes_combined.csv dosyasında birleştirildi')