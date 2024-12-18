package service

import (
	"med-asis/internal/models"
	"med-asis/internal/repository"
)

type PostService struct {
	postRepo repository.PostRepository
}

func NewPostService(postRepo repository.PostRepository) *PostService {
	return &PostService{
		postRepo: postRepo,
	}
}

func (p *PostService) Create(post models.Post) (int, error) {
	return p.postRepo.Create(post)
}

func (p *PostService) GetAll() ([]models.Post, error) {
	return p.postRepo.GetAll()
}

func (p *PostService) GetById(id int) (models.Post, error) {
	return p.postRepo.GetById(id)
}

func (p *PostService) Delete(id int) error {
	return p.postRepo.Delete(id)
}

func (p *PostService) Update(id int, updatedPost models.Post) error {
	return p.postRepo.Update(id, updatedPost)
}

func (p *PostService) InitPosts() {
	p.Create(models.Post{
		Title:       "Иммунные механизмы нейтрофильного воспаления при бронхиальной астме",
		Description: "Ключевые слова: нейтрофилы, нейтрофильное воспаление, бронхиальная астма, Th17-клетки, М1-макрофаги,белок подавления онкогенности 2, нейтрофильные внеклеточные ловушки, микробиом дыхательных путей.",
		Content: `Введение
					Бронхиальная астма (БА) — хроническое воспалительное гетерогенное заболевание дыхательных путей с различными фенотипами, которым страдают более 300 млн человек во всем мире [1]. Гетерогенность астмы затрудняет понимание патофизиологических механизмов заболевания. Одним из фенотипов БА является нейтрофильная астма, о наличии которой до сих пор ведутся споры, которая отличает­ся гетерогенностью [6], нет общепри­знанного четкого ее определения [2–5]. В исследовании австралийских ученых из 149 пациентов с диа­гностированной нейтрофильной астмой только у 7 был подтвержден стабильный, плохо контролируемый подтип нейтрофильной астмы с высоким риском обострений [6]. Условный термин «нейтрофильная астма» подразумевает определенный эндотип астмы, при котором нейтрофилы являются основным типом клеток, опосредующих патофизиологию и симптомы заболевания [2]. Для нейтрофильной астмы характерно нейтрофильное воспаление легких, тяжелое рефрактерное течение со стойкой обструкцией дыхательных путей, частыми обострениями и астматическим статусом, требующими госпитализации, высоким риском смертности и инвалидизации [7, 8]. Отличительной чертой нейтрофильно-доминантной астмы является резистентность к кортикостероидам, которая утяжеляет течение заболевания, делая его трудно контролируемым [3].

					Фенотип БА обычно определяется по клеточному профилю индуцированной мокроты. В отношении нейтрофильной астмы вопрос о том, какой уровень нейтрофилии мокроты соответствует этому фенотипу, остается дискуссионным. По мнению ряда авторов [9, 10], диа­гностическим критерием для определения нейтрофильной астмы является присутствие в индуцированной мокроте менее 3% эозинофилов и увеличение количества нейтрофилов более 60–76%, или более 5106 кл/мл. У здоровых людей средний процент нейтрофилов в индуцированной мокроте — 37% [11]. Очень разнятся данные о встречаемости нейтрофильного фенотипа среди когорты больных БА. В исследовании K.F. Chung [9] нейтрофильный фенотип определялся примерно у 30–50% пациентов с симптоматической астмой. В недавнем исследовании [12] только у 5–10% взрослых пациентов выявлялся фенотип неконтролируемой астмы с выраженной нейтрофилией дыхательных путей и меньшей чувствительностью к терапии кортикостероидами. В перекрестном многофакторном исследовании [13] нейтрофильный фенотип был установлен у 12 (15%) из 80 пациентов с БА. Нейтрофилы в мокроте являются не только маркером эндотипа астмы, но и прогностическим фактором, поскольку высокое содержание нейтрофилов обратно пропорционально отношению объема форсированного выдоха за 1-ю секунду (ОФВ1) к форсированной жизненной емкости легких (ФЖЕЛ) и ожидаемым значениям ОФВ1 до и после пробы с бронходилататором [14].

					`,
		ImageURL: "https://img.lovepik.com/photo/40007/3397.jpg_wh860.jpg",
	})

	p.Create(models.Post{
		Title:       "Возможности использования отечественного обонятельного теста в диагностике типовых форм ольфакторной патологии",
		Description: "Ключевые слова: обоняние, обонятельный тест, диа­гностика обоняния, пороговая способность, идентификационная способность, острый риносинусит, полипозный риносинусит, постинфекционная дисфункция обоняния, аромат.",
		Content: `Введение: диа­гностика нарушений обоняния остается актуальной проблемой медицины. Наиболее часто при диа­гностике используются обонятельные тесты. Ранее нами был разработан обонятельный тест и проведена его валидизация на здоровых добровольцах.

				Цель исследования: оценка возможности диа­гностики различных форм нарушений обоняния с помощью отечественного ольфакторного теста.

				Материал и методы: в настоящем исследовании участвовало 100 пациентов с типовыми формами нарушения обоняния. Пациенты были распределены в 3 группы по нозологиям: острый риносинусит (ОР) (n=50), полипозный риносинусит (ПР) (n=25) и постинфекционная дисфункция обоняния (ПДО) (n=25). Обоняние у пациентов исследовали с помощью разработанного теста и, в качестве метода сравнения, визуально-аналоговой шкалы (ВАШ).

				Во всех группах с помощью обонятельного теста оценивали пороговую и идентификационную способность обоняния. В группах ПР и ПДО исследование проводили однократно, в день осмотра. В группе ОР обоняние оценивали дважды: в день обращения и через 14 дней после лечения.

				Результаты исследования: у пациентов всех групп было выявлено нарушение обоняния. В группе ОР при оценке обоняния по ВАШ и отечественному обонятельному тесту отмечено снижение пороговой способности обоняния без изменения идентификационной способности. Через 14 дней после проведенного лечения показатели пороговой и идентификационной способности обоняния улучшились, а оценка по ВАШ снизилась. У пациентов в группах ПР и ПДО как ВАШ, так и отечественный обонятельный тест выявили снижение пороговой и идентификационной способности обоняния. Во всех группах результаты, полученные с помощью ВАШ, высоко коррелировали с пороговой способностью обоняния, а у пациентов группы ПДО — как с пороговой, так и с идентификационной.

				Заключение: по результатам проведенного исследования продемонстрировано, что отечественный обонятельный тест эффективен в выявлении нарушений обонятельной способности у пациентов с типовыми формами нарушения обоняния.`,
		ImageURL: "https://img.freepik.com/free-photo/flat-lay-arrangement-with-medication_23-2148504633.jpg",
	})

	p.Create(models.Post{
		Title:       "Оториноларингологическая помощь детям с хроническим риносинуситом",
		Description: "Ключевые слова: специализированная оториноларингологическая помощь, хронический риносинусит у детей, Школа здоровья, медико-социальная поддержка детей, респираторная вирусная инфекция.",
		Content:     "Хронический риносинусит (ХРС) — распространенное заболевание, которое оказывает существенное влияние на здоровье и качество жизни детей. ХРС возникает при длительности заболевания более 12 нед. и может привести к серьезным осложнениям. Специализированная оториноларингологическая помощь имеет решающее значение для диа­гностики, лечения и реабилитации пациентов с ХРС. В обзоре представлена система оказания специализированной оториноларингологической помощи детям в Российской Федерации, а также организация медико-социальной поддержки для детей с ХРС. Особое внимание уделяется профилактике обострений ХРС у детей, включающей предотвращение и своевременное лечение острых и рецидивирующих респираторных вирусных инфекций, снижение бактериальной нагрузки, улучшение мукоцилиарного клиренса и диспансерное наблюдение. Также отмечается, что создание Школы здоровья для детей с ХРС поможет научить детей распознавать симптомы обострений ХРС и принимать меры при первых признаках ухудшения состояния.",
		ImageURL:    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlDm1rnHkl8X3kdOM1l-k6UrXYDHalQiPBfQ&s",
	})

	p.Create(models.Post{
		Title:       "Клинические аспекты ведения пациентов с острой и хронической болью",
		Description: "Ключевые слова: боль в спине, остеоартрит, болезнь Бехтерева, ревматоидный артрит, хронический болевой синдром, острый болевой синдром.",
		Content:     "Одной из наиболее частых причин обращения пациентов за врачебной помощью является болевой синдром. В статье рассматривается проблема болевого синдрома у пациентов различного профиля. Представлены различные патогенетические варианты развития дорсалгий на фоне воспалительных и дегенеративно-дистрофических изменений заболеваний. Обобщены основные биомеханические и биохимические процессы, сопровождающие болевой синдром. Рассмотрены особенности течения болевого синдрома в области спины и методов его терапии при таких заболеваниях, как болезнь Бехтерева, остеоартрит, подагрический и ревматоидный артрит. В статье изложены общие принципы терапии острых и хронических ноцицептивных болевых синдромов. Обсуждаются медикаментозные и немедикаментозные методы лечения. Поскольку в большинстве рассмотренных случаев острого и хронического болевого синдрома ведущим патогенетическим механизмом являются воспалительные спе­ци­фические и неспе­ци­фические реакции, то ведущая роль в терапии этих состояний отводится противовоспалительным препаратам. Рассмотрена возможность применения нестероидных противовоспалительных препаратов и витаминов группы В.",
		ImageURL:    "https://www.poligonspb.ru/upload/iblock/e4f/15313815344950.jpg",
	})

	p.Create(models.Post{
		Title:       "First post",
		Description: "This is the first post.",
		Content:     "This is the first post. This is the first post. This is the first post. This is the first post.",
		ImageURL:    "https://lh3.googleusercontent.com/proxy/fj_U7MvRynuhSjuOQ9E6MiFSFVIcGNtFZ1RPa9gZZJah9sSqFWOdrTl5T-sIF15d3-DSCGdDhf3hbtTD-weYoww8vBjXxtSLfqtqF29RHLRH1FSdelo7bPA",
	})

	p.Create(models.Post{
		Title:       "Механизмы действия витаминов B1, B6 и B12 при хронической первичной скелетно-мышечной боли (клиническое наблюдение)",
		Description: "Ключевые слова: ноцицепция, воспаление, нейротропные витамины группы В, тиамин, пиридоксин, цианокобаламин.",
		Content:     "Боль представляет собой сложный комплекс сенсорных и эмоциональных реакций, включающий в себя ноцицептивный, ноципластический и нейропатический компоненты. При этом боль в спине с развитием скелетно-мышечного болевого синдрома занимает особое место в клинической практике. Терапия такой категории пациентов должна быть комплексной и индивидуализированной. Ввиду того, что патофизиологические механизмы развития скелетно-мышечной боли разнообразны, необходимы новые терапевтические подходы, включающие сразу несколько мишеней, учитывающие синергизм между разными анальгетиками и множественные механизмы действия, направленные на контроль ноцицепции. В течение длительного времени обсуждается роль нейротропных витаминов группы B (B1 — тиамин, B6 — пиридоксин и B12 — цианокобаламин) в лечении данного синдрома. Результаты многочисленных исследований продемонстрировали, что витамины группы B вызывают антиноцицептивное, антигиперальгезивное и противовоспалительное действие и уменьшают механическую аллодинию. Поэтому данные лекарственные средства, влияя на ряд патофизиологических механизмов развития боли, играют важнейшую роль в лечении различных сопровождающихся болью состояний.",
		ImageURL:    "https://www.zdrav.ru/images/rubrik_all/zdr_400/kvalifikatsiya_sertifikatsiya_akkreditatsiya/medrabotniki2.jpg",
	})
}
